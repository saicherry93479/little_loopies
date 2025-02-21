export function Breadcrumb() {
  return (
    <nav className="py-4">
      <ol className="flex items-center space-x-2">
        <li>
          <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
        </li>
        <li>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-gray-900">Products</span>
        </li>
      </ol>
    </nav>
  )
} 