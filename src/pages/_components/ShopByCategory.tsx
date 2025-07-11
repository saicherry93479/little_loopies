import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const categories = [
  {
    title: "Baby (0-12m)",
    slug: "baby",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=700",
  },
  {
    title: "Toddler (1-3y)",
    slug: "toddler",
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500&h=700",
  },
  {
    title: "Kids (4-7y)",
    slug: "kids-4-7",
    image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=500&h=700",
  },
  {
    title: "Older Kids (8-14y)",
    slug: "kids-8-14",
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=500&h=700",
  },
  {
    title: "Shoes",
    slug: "kids-shoes",
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&h=700",
  },
  {
    title: "Accessories",
    slug: "kids-accessories",
    image: "https://images.unsplash.com/photo-1617006097724-d751b0c75adf?w=500&h=700",
  },
]

export function ShopByCategory() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])


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
          <a
            key={category.title}
            ref={el => el && (cardsRef.current[index] = el)}
            className="group cursor-pointer"
            href={`/products?category=${category.slug}`}
         
          >
            <div className="relative aspect-[3/4] overflow-hidden mb-4">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <h3 className="text-center font-medium">{category.title}</h3>
          </a>
        ))}
      </div>
    </section>
  )
} 