import { Providers } from './providers'
import './globals.css'

export const metadata = {
  title: 'NeuroLuka - Analisis Luka Otomatis',
  description: 'Aplikasi analisis luka otomatis menggunakan kecerdasan buatan',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 