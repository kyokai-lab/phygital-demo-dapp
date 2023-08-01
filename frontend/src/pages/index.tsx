import { Inter } from 'next/font/google'
import HomePage from '@components/Pages/Homepage';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`}
    >
      <HomePage />
    </div>
  )
}
