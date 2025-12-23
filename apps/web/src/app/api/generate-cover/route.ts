/* eslint-disable node/prefer-global/process */
import OpenAI from 'openai'
import { checkGuestUsage, deductCredits, getUserCredits, getUserFromRequest, recordGuestUsage, saveCoverGeneration } from '@/lib/credits'

// 使用 OpenRouter 调用 GPT-4o-mini
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
})

// ========== 第一步：分析文章生成图片描述（中文） ==========
export async function PUT(req: Request) {
  try {
    const { content } = await req.json()

    if (!content || typeof content !== 'string') {
      return Response.json(
        { error: '请提供文章内容' },
        { status: 400 },
      )
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json(
        { error: '服务暂不可用，请联系管理员配置 OpenRouter API Key' },
        { status: 503 },
      )
    }

    const analysisResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `你是一个专业的公众号封面设计师。根据用户提供的文章内容，生成一段适合 AI 绘图的中文描述。

关键要求：
1. 仔细阅读文章，提取核心主题和关键元素
2. 描述必须与文章内容强相关，体现文章的独特性
3. 如果文章涉及具体工具/产品（如 GSC、SEO、数据分析），要在画面中体现相关元素
4. 如果文章涉及团队协作，要体现多人、权限、协作的视觉元素
5. 避免过于抽象通用的描述，要有具体的视觉元素
6. 风格现代、专业，适合公众号封面
7. 不要在图片中包含文字
8. 控制在 80-150 字
9. 直接输出描述，不要有任何前缀

示例（注意具体性）：
- 文章：《如何用 Google Analytics 分析用户行为》→ 描述：俯视角度的数据仪表盘界面，蓝紫色科技风格，多个数据图表和用户行为热力图，鼠标轨迹和点击分布可视化，左侧有简约的 GA 风格图标，整体干净专业
- 文章：《团队 Git 协作最佳实践》→ 描述：多条彩色分支线从中心发散并汇聚，像地铁线路图，每个节点有小的代码图标，背景深色，霓虹风格的分支颜色，象征代码合并与团队协作
- 文章：《SEO 入门指南》→ 描述：巨大的搜索框居中，周围环绕着上升的排名箭头和关键词标签，网页缩略图层叠展示，绿色增长曲线，象征搜索优化和流量提升`,
        },
        {
          role: 'user',
          content: `请根据以下文章内容，生成封面图片的描述：\n\n${content}`,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    const generatedPrompt = analysisResponse.choices[0]?.message?.content?.trim()

    if (!generatedPrompt) {
      return Response.json(
        { error: '分析文章失败，请重试' },
        { status: 500 },
      )
    }

    return Response.json({ generatedPrompt })
  }
  catch (error) {
    console.error('Analyze article error:', error)

    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return Response.json(
          { error: 'OpenRouter API Key 无效' },
          { status: 401 },
        )
      }
    }

    return Response.json(
      { error: '分析失败，请稍后重试' },
      { status: 500 },
    )
  }
}

// ========== 第二步：根据描述生成图片 ==========
export async function POST(req: Request) {
  try {
    const { prompt, width = 1024, height = 436, fingerprint } = await req.json()

    if (!prompt || typeof prompt !== 'string') {
      return Response.json(
        { error: '请提供图片描述' },
        { status: 400 },
      )
    }

    if (!process.env.EVOLINK_API_KEY) {
      return Response.json(
        { error: '服务暂不可用，请联系管理员配置 EvoLink API Key' },
        { status: 503 },
      )
    }

    // 获取客户端 IP 地址
    const forwarded = req.headers.get('x-forwarded-for')
    const ipAddress = forwarded ? forwarded.split(',')[0].trim() : null

    // 检查用户积分
    const user = await getUserFromRequest(req)
    let userId: string | null = null
    let isGuest = false

    if (user) {
      userId = user.userId
      const credits = await getUserCredits(userId)

      if (credits === null) {
        return Response.json(
          { error: '获取用户信息失败，请重新登录' },
          { status: 401 },
        )
      }

      if (credits < 1) {
        return Response.json(
          { error: '积分不足，请充值后再试', code: 'INSUFFICIENT_CREDITS' },
          { status: 402 },
        )
      }
    }
    else {
      // 未登录用户：服务端检查访客使用额度
      isGuest = true
      const guestUsage = await checkGuestUsage(fingerprint || null, ipAddress)

      if (!guestUsage.allowed) {
        return Response.json(
          {
            error: '今日免费额度已用完，登录获取更多额度',
            code: 'GUEST_LIMIT_REACHED',
            used: guestUsage.used,
            remaining: guestUsage.remaining,
          },
          { status: 429 },
        )
      }
    }

    const size = `${width}x${height}`
    console.log('Generating image with prompt:', prompt, 'size:', size, 'user:', userId || 'guest')

    // 第一步：创建图片生成任务
    const createResponse = await fetch('https://api.evolink.ai/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EVOLINK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'z-image-turbo',
        prompt,
        n: 1,
        size, // 使用 "宽x高" 格式，如 "1024x436"
      }),
    })

    const taskData = await createResponse.json()
    console.log('EvoLink task created:', JSON.stringify(taskData, null, 2))

    if (!createResponse.ok || !taskData.id) {
      console.error('Failed to create task:', taskData)
      return Response.json(
        { error: taskData.error?.message || '创建任务失败' },
        { status: createResponse.status },
      )
    }

    const taskId = taskData.id

    // 第二步：轮询任务状态直到完成（最多等待 60 秒）
    const maxAttempts = 30
    const pollInterval = 2000 // 2 秒

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, pollInterval))

      const statusResponse = await fetch(`https://api.evolink.ai/v1/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${process.env.EVOLINK_API_KEY}`,
        },
      })

      const statusData = await statusResponse.json()
      console.log(`Task status (attempt ${attempt + 1}):`, statusData.status, statusData.progress)

      if (statusData.status === 'completed' && statusData.results?.length > 0) {
        const imageUrl = statusData.results[0]
        console.log('Image generated:', imageUrl)

        // 生成成功后扣减积分并保存记录
        if (userId) {
          const deductResult = await deductCredits(
            userId,
            1,
            '生成封面图片',
          )
          if (!deductResult.success) {
            console.error('Failed to deduct credits:', deductResult.error)
          }
          else {
            console.log('Credits deducted, new balance:', deductResult.newBalance)
          }

          // 保存生成记录
          const saveResult = await saveCoverGeneration({
            userId,
            prompt,
            imageUrl,
            width,
            height,
            creditsUsed: 1,
          })
          if (!saveResult.success) {
            console.error('Failed to save cover generation:', saveResult.error)
          }
          else {
            console.log('Cover generation saved:', saveResult.id)
          }
        }
        else if (isGuest) {
          // 记录访客使用
          const recorded = await recordGuestUsage(fingerprint || null, ipAddress)
          if (recorded) {
            console.log('Guest usage recorded, fingerprint:', fingerprint, 'ip:', ipAddress)
          }
          else {
            console.error('Failed to record guest usage')
          }
        }

        return Response.json({ imageUrl })
      }

      if (statusData.status === 'failed') {
        console.error('Task failed:', statusData)
        return Response.json(
          { error: '图片生成失败，请重试' },
          { status: 500 },
        )
      }
    }

    // 超时
    return Response.json(
      { error: '图片生成超时，请重试' },
      { status: 504 },
    )
  }
  catch (error) {
    console.error('Cover generation error:', error)

    return Response.json(
      { error: error instanceof Error ? error.message : '生成失败，请稍后重试' },
      { status: 500 },
    )
  }
}
