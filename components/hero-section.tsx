import React from "react"
import { Button } from "@/components/ui/button"
import { Header } from "./header"
import { HeroBackground } from "./hero-background"
import Link from "next/link"
import { AnimatedSection } from "./animated-section"
import { DashboardPreview } from "./dashboard-preview"

export function HeroSection() {
  return (
    <section
      id="hero-section-container"
      // "overflow-hidden" has been removed from the line below
      className="relative flex w-full flex-col items-center text-center h-[400px] md:h-[600px] lg:h-[810px]"
    >
      <HeroBackground />

      {/* Header is positioned at the top and will be centered by its own styles */}
      <div id="hero-header-container" className="absolute top-0 left-0 right-0 z-20">
        <Header />
      </div>

      {/* Main content wrapper with padding and centering */}
      <div
        id="hero-content-wrapper"
        className="relative z-10 flex h-full w-full max-w-7xl flex-col items-center justify-center space-y-6 px-4 md:space-y-8"
      >
        <div id="hero-text-container" className="space-y-4 md:space-y-5 lg:space-y-6 max-w-md md:max-w-xl lg:max-w-3xl">
          <h1 className="text-foreground text-3xl md:text-4xl lg:text-6xl font-semibold leading-tight">
            Build, Scale And Transform Your Workforce Rapidly
          </h1>
          <p className="text-muted-foreground text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Empower your team with autonomous AI agents that work alongside humans while providing real-time intelligence
            assistance to enhance every employee's capabilities.
          </p>
        </div>

        <div id="hero-cta-button-container">
          <Link href="#">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-3 rounded-full font-medium text-base shadow-lg ring-1 ring-white/10">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </div>

      {/* Dashboard Preview Wrapper - Positioned further down */}
      <div
        id="hero-dashboard-preview-container"
        className="absolute bottom-[-220px] md:bottom-[-500px] left-1/2 transform -translate-x-1/2 z-0"
      >
        <AnimatedSection>
          <DashboardPreview />
        </AnimatedSection>
      </div>
    </section>
  )
}