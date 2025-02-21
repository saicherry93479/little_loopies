
const customerServiceas = [
  { label: 'Contact Us', href: '/contact' },
  { label: 'Order Status', href: '/orders' },
  { label: 'Shipping', href: '/shipping' },
  { label: 'Return Policy & Exchanges', href: '/returns' },
  { label: 'Price Adjustments', href: '/price-adjustments' },
  { label: 'Gift Cards', href: '/gift-cards' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Product Recalls', href: '/recalls' }
]

const aboutas = [
  { label: 'All Brands', href: '/brands' },
  { label: 'Careers', href: '/careers' },
  { label: 'Corporate Social Responsibility', href: '/csr' },
  { label: 'Diversity, Inclusion & Belonging', href: '/diversity' },
  { label: 'Get Email Updates', href: '/email-signup' },
  { label: 'Nordstrom Blog', href: '/blog' },
  { label: 'Nordy Podcast', href: '/podcast' },
  { label: 'Store Location', href: '/stores' }
]

const socialas = [
  { label: 'Instagram', icon: '/icons/instagram.svg', href: '#' },
  { label: 'Pinterest', icon: '/icons/pinterest.svg', href: '#' },
  { label: 'Twitter', icon: '/icons/twitter.svg', href: '#' },
  { label: 'Facebook', icon: '/icons/facebook.svg', href: '#' }
]

export function Footer() {
  return (
    <footer className="bg-[#F0F3F5]">
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Customer Service Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-3">
              {customerServiceas.map(a => (
                <li key={a.href}>
                  <a 
                    href={a.href}
                    className="text-gray-800 hover:text-gray-600"
                  >
                    {a.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <button className="flex items-center gap-2 text-gray-800">
                  <img src="/IN.gif" alt="India" className="w-4 h-4 rounded-full" />
                  <span>India</span>
                </button>
              </li>
            </ul>
          </div>

          {/* About Us Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">About Us</h3>
            <ul className="space-y-3">
              {aboutas.map(a => (
                <li key={a.href}>
                  <a 
                    href={a.href}
                    className="text-gray-800 hover:text-gray-600"
                  >
                    {a.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social as */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-lg mb-4">Connect with Us</h3>
            <div className="flex gap-4">
              {socialas.map(a => (
                <a 
                  key={a.href}
                  href={a.href}
                  className="text-gray-800 hover:text-gray-600"
                >
                  <img src={a.icon} alt={a.label} className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-wrap items-center gap-4 mt-16 pt-8 border-t border-gray-200 text-sm text-gray-800">
          <a href="/privacy" className="hover:text-gray-600">
            Privacy
          </a>
          <div className="flex items-center gap-2">
            <a href="/privacy-rights" className="hover:text-gray-600">
              Your Privacy Rights
            </a>
            <img src="/ccpa-icon.svg" alt="CCPA" className="w-8 h-5" />
          </div>
          <a href="/terms" className="hover:text-gray-600">
            Terms & Conditions
          </a>
          <span className="text-gray-600">©2024 Nordstrom, Inc.</span>
        </div>

        {/* Back to Top Button */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed z-[100] bottom-8 right-8 bg-white/75 p-4 rounded shadow-lg"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path d="M8.59 7.41L10 6l6 6-6 6-1.41-1.41L13.17 12z" transform="rotate(-90 12 12)" />
          </svg>
          <span className="text-xs mt-1">Top</span>
        </button>
      </div>
    </footer>
  )
} 