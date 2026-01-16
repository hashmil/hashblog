import { Link } from '@tanstack/react-router'

interface HeaderProps {
  onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#121212]/80 backdrop-blur-md border-b border-gray-800">
      <div className="container py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="flex items-center group hover:opacity-80 transition-opacity duration-200"
              >
                <img
                  src="/images/logo.png"
                  alt="Notes by Hash Milhan"
                  className="h-8 object-contain"
                />
              </Link>
            </div>

            {/* Menu Button */}
            <div className="flex-shrink-0">
              <button
                onClick={onMenuToggle}
                className="flex items-center space-x-2 text-white hover:text-[#FF5682] transition-colors duration-200"
                aria-label="Open menu"
              >
                <span className="font-accent">Menu</span>
                <div className="flex flex-col space-y-1">
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
