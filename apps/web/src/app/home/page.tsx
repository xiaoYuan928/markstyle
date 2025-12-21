import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { ThemeShowcase } from '@/components/landing/ThemeShowcase'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <Features />
      <ThemeShowcase />
      <HowItWorks />
      <Footer />
    </main>
  )
}
