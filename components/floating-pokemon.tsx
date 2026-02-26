'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const pokemonList = [25, 39, 54, 58, 74, 96, 104, 109, 128, 133, 138, 147]

export function FloatingPokemonBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const floatingElements = containerRef.current.querySelectorAll('[data-float]')
    floatingElements.forEach((element, index) => {
      const delay = index * 0.2
      const duration = 4 + Math.random() * 2
      const yAmount = -30 - Math.random() * 20
      const xAmount = (Math.random() - 0.5) * 60

      gsap.to(element, {
        duration,
        y: yAmount,
        x: xAmount,
        rotation: 360,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay,
      })
    })
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {pokemonList.map((id, index) => (
        <div
          key={id}
          data-float={true}
          className="absolute opacity-20 blur-xl"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: '200px',
            height: '200px',
          }}
        >
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full text-blue-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="100" cy="100" r="80" opacity="0.3" />
            <circle cx="100" cy="100" r="60" opacity="0.2" />
            <circle cx="100" cy="100" r="40" opacity="0.1" />
            {index % 3 === 0 && (
              <path d="M 100 40 Q 120 60 100 80 Q 80 60 100 40" />
            )}
            {index % 3 === 1 && (
              <path d="M 50 100 L 100 100 L 100 150" strokeLinecap="round" />
            )}
            {index % 3 === 2 && (
              <path d="M 70 70 L 130 130 M 130 70 L 70 130" />
            )}
          </svg>
        </div>
      ))}
    </div>
  )
}
