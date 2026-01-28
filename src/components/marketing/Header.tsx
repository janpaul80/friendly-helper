import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, Menu, X, ChevronDown, Terminal, Code2 } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFeaturesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper to navigate to homepage section
  const getSectionLink = (section: string) => {
    return location.pathname === "/" ? section : `/${section}`;
  };

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
          {/* Features Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setFeaturesOpen(!featuresOpen)}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              Features
              <ChevronDown className={`w-4 h-4 transition-transform ${featuresOpen ? "rotate-180" : ""}`} />
            </button>
            {featuresOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                <Link
                  to="/features/ide"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                  onClick={() => setFeaturesOpen(false)}
                >
                  <Code2 className="w-4 h-4 text-orange-500" />
                  <span className="text-white">IDE</span>
                </Link>
                <Link
                  to="/features/cli"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                  onClick={() => setFeaturesOpen(false)}
                >
                  <Terminal className="w-4 h-4 text-orange-500" />
                  <span className="text-white">CLI</span>
                </Link>
              </div>
            )}
          </div>
          <a href={getSectionLink("#features")} className="hover:text-white transition-colors">Products</a>
          <a href={getSectionLink("#pricing")} className="hover:text-white transition-colors">Pricing</a>
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
          <nav className="flex flex-col space-y-1 text-sm font-medium text-gray-400 mb-4">
            {/* Mobile Features Dropdown */}
            <button
              onClick={() => setMobileFeaturesOpen(!mobileFeaturesOpen)}
              className="flex items-center justify-between py-2 hover:text-white transition-colors"
            >
              <span>Features</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileFeaturesOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileFeaturesOpen && (
              <div className="pl-4 space-y-1 border-l border-white/10 ml-2">
                <Link
                  to="/features/ide"
                  className="flex items-center gap-3 py-2 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Code2 className="w-4 h-4 text-orange-500" />
                  <span>IDE</span>
                </Link>
                <Link
                  to="/features/cli"
                  className="flex items-center gap-3 py-2 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Terminal className="w-4 h-4 text-orange-500" />
                  <span>CLI</span>
                </Link>
              </div>
            )}
            <a href={getSectionLink("#features")} className="py-2 hover:text-white transition-colors">Products</a>
            <a href={getSectionLink("#pricing")} className="py-2 hover:text-white transition-colors">Pricing</a>
            <Link to="/referrals" className="py-2 hover:text-white transition-colors">Referrals</Link>
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
