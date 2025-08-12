import React from "react"

export function AnimatedHeroBackground() {
  return (
    <div
      id="animated-hero-bg-container"
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
    >
      {/* This div will have the animated gradient */}
      <div className="animated-gradient-background absolute inset-0"></div>

      {/* This div creates the static "grainy" texture overlay */}
      <div className="noise-overlay"></div>
    </div>
  )
}