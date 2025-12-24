'use client'

import { useEffect, useState } from 'react'

const ONBOARDING_KEY = 'markstyle-onboarding-seen'

interface Step {
  title: string
  description: string
  icon: string
}

const steps: Step[] = [
  {
    title: '欢迎使用 MarkStyle',
    description: '一款专为公众号排版设计的 Markdown 编辑器，免费、简洁、高效。',
    icon: 'waving_hand',
  },
  {
    title: '编写与预览',
    description: '在左侧编写 Markdown 内容，右侧实时预览排版效果。支持从飞书、Notion 直接粘贴。',
    icon: 'edit_note',
  },
  {
    title: '选择主题',
    description: '点击右侧设置面板，从 20+ 精美主题中选择你喜欢的风格。',
    icon: 'palette',
  },
  {
    title: '一键复制',
    description: '编辑完成后，点击右上角「复制到公众号」按钮，粘贴到公众号后台即可发布。',
    icon: 'content_copy',
  },
]

export function OnboardingDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeen = localStorage.getItem(ONBOARDING_KEY)
    if (!hasSeen) {
      // Small delay to let the editor load first
      const timer = setTimeout(() => setIsOpen(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setIsOpen(false)
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
    else {
      handleClose()
    }
  }

  const handleSkip = () => {
    handleClose()
  }

  if (!isOpen)
    return null

  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleSkip}
      />

      {/* Dialog */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-4xl">
              {step.icon}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            {step.description}
          </p>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-primary w-6'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              跳过
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              {isLastStep ? '开始使用' : '下一步'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
