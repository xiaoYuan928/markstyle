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
  title: 'MarkStyle | 公众号排版美化工具',
  description: '免费的公众号排版工具，支持 Markdown 编辑，一键复制到微信公众号，多种精美主题，让排版更简单',
  keywords: ['公众号排版', 'Markdown', '微信公众号', '排版工具', '免费主题'],
  icons: {
    icon: '/icon.svg',
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
