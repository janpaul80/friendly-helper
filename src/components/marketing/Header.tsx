import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Menu, X } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md px-4 sm:px-6 py-4">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(234,88,12,0.4)]">
            <Zap size={20} fill="currentColor" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">HeftCoder</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Products</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <Link to="/referrals" className="hover:text-white transition-colors">Referrals</Link>
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          <Link
            to="/auth"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/auth?provider=google"
            className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg font-bold transition-all hover:scale-105 shadow-[0_0_15px_rgba(234,88,12,0.2)]"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-gray-400 mb-4">
            <a href="#features" className="hover:text-white transition-colors">Products</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <Link to="/referrals" className="hover:text-white transition-colors">Referrals</Link>
          </nav>
          <div className="flex flex-col gap-3">
            <Link
              to="/auth"
              className="text-gray-400 hover:text-white transition-colors text-center py-2"
            >
              Log in
            </Link>
            <Link
              to="/auth?provider=google"
              className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-bold transition-all text-center shadow-[0_0_15px_rgba(234,88,12,0.2)]"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
