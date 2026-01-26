import { Link, useNavigate } from 'react-router-dom';
import { Plus, Zap, LogOut, Terminal, Menu } from 'lucide-react';
import { useState } from 'react';

interface DashboardHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCreateProject: () => void;
  onLogout: () => void;
}

export function DashboardHeader({ activeTab, onTabChange, onCreateProject, onLogout }: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'recents', label: 'Projects' },
    { id: 'studio', label: 'Studio' },
    { id: 'utilities', label: 'Utilities' },
    { id: 'saved', label: 'Archives' },
  ];

  return (
    <header className="border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="px-4 md:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="h-9 w-9 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-900/30">
            <Zap size={20} fill="currentColor" />
          </div>
          <div className="hidden sm:block">
            <span className="text-white font-black text-lg tracking-tight">HeftCoder</span>
            <span className="text-[8px] text-orange-500 font-bold uppercase tracking-widest ml-2 bg-orange-500/10 px-1.5 py-0.5 rounded">CMD</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[#111118] rounded-xl p-1 border border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/30'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCreateProject}
            className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-orange-900/30 text-white"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New Project</span>
          </button>
          
          <button
            onClick={onLogout}
            className="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-gray-500 hover:text-white border border-white/5"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 hover:bg-white/5 rounded-xl transition-colors text-gray-500 hover:text-white border border-white/5"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 p-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-500 bg-[#111118] border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
