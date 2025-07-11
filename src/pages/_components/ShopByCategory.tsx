import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useNavigate } from 'astro:transitions/client'

gsap.registerPlugin(ScrollTrigger)

const categories = [
  {
    title: "Women",
    slug: "women",
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=500&h=700",
  },
  {
    title: "Men",
    slug: "men",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=500&h=700",
  },
  {
    title: "Kids",
    slug: "kids",
    image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=500&h=700",
  },
  {
    title: "Designer",
    slug: "designer",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&h=700",
  },
  {
    title: "Home",
    slug: "home",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&h=700",
  },
  {
    title: "Beauty & Fragrance",
    slug: "beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=700",
  },
]

export function ShopByCategory() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const section = sectionRef.current
    const cards = cardsRef.current

    gsap.fromTo(section?.querySelector('h2'), 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        }
      }
    )

    cards.forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          }
        }
      )
    })
  }, [])

  return (
    <section ref={sectionRef} className="max-w-[1600px] mx-auto px-4 py-16">
      <h2 className="text-center text-2xl font-bold mb-12">
        SHOP BY CATEGORY
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((category, index) => (
          <div
            key={category.title}
            ref={el => el && (cardsRef.current[index] = el)}
            className="group cursor-pointer"
            onClick={() => navigate(`/products?category=${category.slug}`)}
          >
            <div className="relative aspect-[3/4] overflow-hidden mb-4">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <h3 className="text-center font-medium">{category.title}</h3>
          </div>
        ))}
      </div>
    </section>
  )
} 