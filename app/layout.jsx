import '../globals.css'
import Navbar from '../src/components/Navbar'
import { AuthProvider } from '../src/context/AuthContext'

export const metadata = {
  title: 'JustWrite',
  description: 'Free professional invoice and estimate templates for contractors and service businesses.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-[#111318]">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
