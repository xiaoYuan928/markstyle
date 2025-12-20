import type { IConfigOption } from '../types'
import type { ThemeName } from './theme-css'

// 导出 CSS 主题（新主题系统）
export { baseCSSContent, themeMap, type ThemeName } from './theme-css'

export const themeOptionsMap = {
  simple: {
    label: `简洁`,
    value: `simple`,
    desc: ``,
  },
  ink: {
    label: `墨韵`,
    value: `ink`,
    desc: `中国风水墨`,
  },
  neon: {
    label: `霓虹`,
    value: `neon`,
    desc: `赛博朋克`,
  },
  journal: {
    label: `手账`,
    value: `journal`,
    desc: `手绘风格`,
  },
  noir: {
    label: `极简黑`,
    value: `noir`,
    desc: `高端商务`,
  },
  gradient: {
    label: `渐变`,
    value: `gradient`,
    desc: `立体渐变`,
  },
  vivid: {
    label: `多彩`,
    value: `vivid`,
    desc: `鲜艳活泼`,
  },
  tech: {
    label: `科技蓝`,
    value: `tech`,
    desc: `SaaS风格`,
  },
}

export const themeOptions: IConfigOption<ThemeName>[] = [
  {
    label: `简洁`,
    value: `simple`,
    desc: ``,
  },
  {
    label: `墨韵`,
    value: `ink`,
    desc: `中国风水墨`,
  },
  {
    label: `霓虹`,
    value: `neon`,
    desc: `赛博朋克`,
  },
  {
    label: `手账`,
    value: `journal`,
    desc: `手绘风格`,
  },
  {
    label: `极简黑`,
    value: `noir`,
    desc: `高端商务`,
  },
  {
    label: `渐变`,
    value: `gradient`,
    desc: `立体渐变`,
  },
  {
    label: `多彩`,
    value: `vivid`,
    desc: `鲜艳活泼`,
  },
  {
    label: `科技蓝`,
    value: `tech`,
    desc: `SaaS风格`,
  },
]
