import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const heroImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=1600&h=900",
    title: "Back to School Collection",
    subtitle: "Fun & colorful outfits for your little ones"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=1600&h=900",
    title: "Playtime Ready",
    subtitle: "Comfortable & durable clothes for active kids"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=1600&h=900",
    title: "Adventure Awaits",
    subtitle: "Explore our new collection of kids' outdoor wear"
  }
]

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    // gsap.fromTo(
    //   containerRef.current.children[currentIndex],
    //   { opacity: 0, scale: 1.1 },
    //   { 
    //     opacity: 1, 
    //     scale: 1,
    //     duration: 1,
    //     ease: 'power2.out'
    //   }
    // )
  }, [currentIndex])

  return (
    <div className="relative h-[700px] px-16  overflow-hidden">
      <div ref={containerRef} className="relative h-full">
        {heroImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <h1 className="text-5xl font-bold mb-4">{image.title}</h1>
              <p className="text-xl">{image.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
} 