import Hero from './components/sections/Hero'
import Services from './components/sections/Services'
import Portfolio from './components/sections/Portofolio'
import Process from './components/sections/Process'
import CTA from './components/sections/CTA'
import Navbar from './components/sections/Navbar'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <Portfolio />
      <Process />
      <CTA />
    </main>
  )
}