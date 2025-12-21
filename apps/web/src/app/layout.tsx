import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { JetBrains_Mono, Noto_Sans_SC } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const notoSansSC = Noto_Sans_SC({
  variable: '--font-noto-sans-sc',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'MarkStyle - 免费公众号排版工具 | Markdown 编辑器',
  description: '免费的微信公众号排版工具，支持 Markdown 编辑、8+ 精美主题、一键复制到公众号。支持从飞书、Notion 粘贴内容自动转换。',
  keywords: ['公众号排版', '微信排版工具', 'Markdown编辑器', '公众号美化', '免费排版', '微信公众号', '排版工具'],
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'MarkStyle - 免费公众号排版工具',
    description: '让公众号排版更简单 - 8+ 精美主题，一键复制到微信公众号',
    type: 'website',
    url: 'https://markstyle.org',
    siteName: 'MarkStyle',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MarkStyle - 免费公众号排版工具',
    description: '让公众号排版更简单 - 8+ 精美主题，一键复制到微信公众号',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://markstyle.org',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${notoSansSC.variable} ${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
