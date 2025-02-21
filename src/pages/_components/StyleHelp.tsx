import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function StyleHelp() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const elements = section?.querySelectorAll('.animate')

    elements?.forEach((el, index) => {
      gsap.fromTo(el,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
          }
        }
      )
    })
  }, [])

  return (
    <section ref={sectionRef} className="max-w-[1600px] mx-auto px-4 mb-16">
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] bg-gray-100 rounded-lg overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=1600&h=400"
          alt="Kids Style Services"
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-transparent" />
        
        <div className="absolute top-1/2 left-8 md:left-16 -translate-y-1/2 max-w-[90%] md:max-w-[550px]">
          <h2 className="animate text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            Fun Style Help for Kids
          </h2>
          <p className="animate text-base md:text-lg mb-6 text-gray-800">
            Let our experts help you find the perfect outfits for your little ones. 
            From playdates to parties, we've got everything they need to look and feel amazing!
          </p>
          <div className="animate flex flex-col md:flex-row gap-4 md:gap-8">
            <a 
              href="#" 
              className="inline-flex items-center text-base md:text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors"
            >
              Kids' Style Guide
              <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
              </svg>
            </a>
            <a 
              href="#" 
              className="inline-flex items-center text-base md:text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors"
            >
              Size Guide
              <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
} 