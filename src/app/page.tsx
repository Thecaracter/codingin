import Hero from './components/sections/Hero'
import Services from './components/sections/Services'
import Portfolio from './components/sections/Portofolio'
import Process from './components/sections/Process'
import CTA from './components/sections/CTA'

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Portfolio />
      <Process />
      <CTA />
    </main>
  )
}