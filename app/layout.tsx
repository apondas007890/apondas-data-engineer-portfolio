import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Apon Kumar Das | Data Engineer',
  description:
    'Data Engineer portfolio of Apon Kumar Das, showcasing data projects, skills, experience, certifications, and SQL-inspired portfolio experiences.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
      },
      {
        url: '/icon.png',
        type: 'image/png',
      },
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-touch-icon.png',
  },
  applicationName: 'Apon Kumar Das Portfolio',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-[#2d2d30]">
      <body className="bg-[#2d2d30] font-mono antialiased overflow-x-hidden">
        <Script
          id="route-title-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var p = window.location.pathname;
                var t = 'Apon Kumar Das | Data Engineer';
                if (p === '/') t = 'SQL Shades | SSMS Portfolio';
                else if (/^\\/admin\\/?$/.test(p)) t = 'Portfolio Admin | Apon Kumar Das';
                else if (/^\\/admin\\/login\\/?$/.test(p)) t = 'Admin Login | Apon Kumar Das';
                else if (/^\\/admin\\/(recovery|update-password)\\/?$/.test(p)) t = 'Account Recovery | Apon Kumar Das';
                document.title = t;
              })();
            `,
          }}
        />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
