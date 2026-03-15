import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Beaker, FlaskConical, Orbit, Grid, Zap, Trophy, Flame, Menu, X, BookOpen } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export const Navbar = () => {
  const location = useLocation();
  const points = useGameStore((s: any) => s.points);
  const level = useGameStore((s: any) => s.level);
  const visitedSteps = useGameStore((s: any) => s.visitedSteps || []);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Calculate course progress (out of 3 steps)
  const progressPercent = Math.round((visitedSteps.length / 3) * 100);

  const primaryLinks = [
    { path: '/', label: 'Home', icon: Beaker },
    { path: '/lab', label: 'The Lab', icon: FlaskConical },
    { path: '/syllabus', label: 'Study', icon: BookOpen },
    { path: '/periodic-table', label: 'Elements', icon: Grid },
  ];

  const secondaryLinks = [
    { path: '/sandbox', label: 'Sandbox', icon: FlaskConical },
    { path: '/missions', label: 'Missions', icon: Orbit },
    { path: '/baking-soda', label: 'Baking Soda', icon: Flame },
  ];

  const allLinks = [...primaryLinks, ...secondaryLinks];

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo + Progress Ring */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            {/* SVG Progress Ring */}
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
              <circle 
                cx="18" cy="18" r="15" fill="none" 
                stroke="url(#progressGrad)" strokeWidth="2.5" 
                strokeDasharray={`${progressPercent * 0.94} 100`} 
                strokeLinecap="round" 
                style={{ transition: 'stroke-dasharray 0.6s ease' }}
              />
              <defs>
                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Beaker className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-bold tracking-wider gradient-text uppercase">Zero-G Lab</span>
            <span className="text-[10px] text-zinc-600 block -mt-0.5">{progressPercent}% complete</span>
          </div>
        </div>

        {/* Desktop Primary Links */}
        <div className="hidden md:flex items-center gap-1">
          {primaryLinks.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`
                  relative px-4 py-2 rounded-full flex items-center gap-1.5 text-sm font-medium transition-all duration-300
                  ${isActive ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : ''}`} />
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-indigo-500 rounded-t-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                )}
              </Link>
            );
          })}
          <div className="w-px h-5 bg-white/10 mx-1" />
          {secondaryLinks.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`
                  relative px-3 py-2 rounded-full flex items-center gap-1.5 text-xs font-medium transition-all duration-300
                  ${isActive ? 'text-white bg-white/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}
                `}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : ''}`} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right: Points HUD + Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/8 rounded-full px-3 py-1.5">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-bold text-zinc-300">Lv {level}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/[0.04] border border-amber-500/15 rounded-full px-3 py-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span id="nav-points" className="text-xs font-bold text-amber-300">{points}</span>
          </div>
          
          {/* Mobile Hamburger */}
          <button 
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0a0a12]/95 backdrop-blur-xl border-t border-white/5 p-4 space-y-1">
          {allLinks.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${isActive ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : ''}`} />
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};
