import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const animateCardEntrance = (element: HTMLElement | null, delay = 0) => {
  if (!element) return
  gsap.from(element, {
    duration: 0.6,
    opacity: 0,
    y: 30,
    scale: 0.95,
    delay,
    ease: 'back.out(1.7)',
  })
}

export const animateCardHover = (element: HTMLElement | null) => {
  if (!element) return
  gsap.to(element, {
    duration: 0.3,
    y: -8,
    boxShadow: '0 20px 40px rgba(112, 180, 255, 0.3)',
    ease: 'power2.out',
  })
}

export const animateCardHoverOut = (element: HTMLElement | null) => {
  if (!element) return
  gsap.to(element, {
    duration: 0.3,
    y: 0,
    boxShadow: '0 10px 30px rgba(112, 180, 255, 0.1)',
    ease: 'power2.out',
  })
}

export const animateScrollReveal = (element: HTMLElement | null) => {
  if (!element) return
  gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      end: 'top 50%',
      scrub: 0.5,
      markers: false,
    },
    opacity: 0,
    y: 40,
    duration: 1,
    ease: 'power3.out',
  })
}

export const animateFloatingElement = (element: HTMLElement | null, duration = 4) => {
  if (!element) return
  gsap.to(element, {
    duration,
    y: -20,
    rotation: 5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })
}

export const animateCardExpand = (element: HTMLElement | null) => {
  if (!element) return

  const tl = gsap.timeline()

  tl.to(element, {
    duration: 0.5,
    scale: 1.05,
    boxShadow: '0 30px 60px rgba(112, 180, 255, 0.4)',
    ease: 'back.out(1.5)',
  })

  return tl
}

export const animateFilterChange = (container: HTMLElement | null) => {
  if (!container) return
  const cards = container.querySelectorAll('[data-card]')

  gsap.to(cards, {
    duration: 0.4,
    opacity: 0,
    y: 20,
    stagger: 0.05,
    ease: 'power2.in',
    onComplete: () => {
      gsap.to(cards, {
        duration: 0.6,
        opacity: 1,
        y: 0,
        stagger: 0.05,
        ease: 'back.out(1.5)',
      })
    },
  })
}

export const smoothScroll = (target: HTMLElement | null) => {
  if (!target) return
  gsap.to(window, {
    duration: 1,
    scrollTo: {
      y: target,
      autoKill: false,
    },
    ease: 'power2.inOut',
  })
}
