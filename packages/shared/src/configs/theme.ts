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
  magazine: {
    label: `杂志`,
    value: `magazine`,
    desc: `纸感杂志风`,
  },
  duo: {
    label: `双色`,
    value: `duo`,
    desc: `极简双色`,
  },
  glass: {
    label: `玻璃`,
    value: `glass`,
    desc: `玻璃拟态淡彩`,
  },
  grid: {
    label: `方格本`,
    value: `grid`,
    desc: `网格手账`,
  },
  newspaper: {
    label: `报纸`,
    value: `newspaper`,
    desc: `极简报纸`,
  },
  letter: {
    label: `信笺`,
    value: `letter`,
    desc: `邮戳信笺`,
  },
  card: {
    label: `卡片`,
    value: `card`,
    desc: `百科卡片`,
  },
  doodle: {
    label: `涂鸦`,
    value: `doodle`,
    desc: `手绘涂鸦`,
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
  {
    label: `杂志`,
    value: `magazine`,
    desc: `纸感杂志风`,
  },
  {
    label: `双色`,
    value: `duo`,
    desc: `极简双色`,
  },
  {
    label: `玻璃`,
    value: `glass`,
    desc: `玻璃拟态淡彩`,
  },
  {
    label: `方格本`,
    value: `grid`,
    desc: `网格手账`,
  },
  {
    label: `报纸`,
    value: `newspaper`,
    desc: `极简报纸`,
  },
  {
    label: `信笺`,
    value: `letter`,
    desc: `邮戳信笺`,
  },
  {
    label: `卡片`,
    value: `card`,
    desc: `百科卡片`,
  },
  {
    label: `涂鸦`,
    value: `doodle`,
    desc: `手绘涂鸦`,
  },
]
