import '@/app/globals.css'
import './styles/landing.css'
import BackgroundWrapper from './components/BackgroundWrapper'

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="landing-container">
      <BackgroundWrapper>
        {children}
      </BackgroundWrapper>
    </div>
  )
}