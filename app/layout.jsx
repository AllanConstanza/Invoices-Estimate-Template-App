import '../globals.css'

export const metadata = {
  title: 'Invoice & Estimate Templates',
  description: 'Free professional invoice and estimate templates for contractors and service businesses.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
