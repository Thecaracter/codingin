import "./globals.css"
import { Inter } from "next/font/google"
import { Analytics } from '@vercel/analytics/react'
import BackgroundWrapper from './components/BackgroundWrapper'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: 'Codingin',
  description: 'Professional Web Development Services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <BackgroundWrapper>
          {children}
        </BackgroundWrapper>
        <Analytics />
      </body>
    </html>
  )
}
