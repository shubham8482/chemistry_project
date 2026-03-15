import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Beaker, FlaskConical, Atom, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import './Home.css';

export const Home = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const visitedSteps = useGameStore((s: any) => s.visitedSteps || []);
  
  // State to track cursor position relative to the center of the screen
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { innerWidth, innerHeight } = window;
      // Calculate cursor position from -1 to 1 relative to center
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      
      setCursorPos({ x, y });
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div className="home-container">
      {/* PHASE 2: The Structural Layout (HTML) */}
      <section ref={heroRef} className="hero-section">
        
        {/* Layer 1: The background environment (Moves slowest) */}
        <div 
          className="parallax-layer layer-1-background"
          style={{ transform: `translate(${cursorPos.x * -10}px, ${cursorPos.y * -10}px) scale(1.05)` }}
        />
        
        {/* Layer 2: The macro object (smartphone exterior - Moves slightly faster) */}
        <div 
          className="parallax-layer layer-2-macro"
          style={{ transform: `translate(${cursorPos.x * -20}px, ${cursorPos.y * -20}px) scale(1.05)` }}
        />
        
        {/* Layer 3: The micro object (circuits and silicon - Moves faster) */}
        <div 
          className="parallax-layer layer-3-micro"
          style={{ transform: `translate(${cursorPos.x * -40}px, ${cursorPos.y * -40}px) scale(1.05)` }}
        />
        
        {/* Layer 4: The atomic level (glowing electrons and atoms - Moves the fastest) */}
        <div 
          className="parallax-layer layer-4-atomic"
          style={{ transform: `translate(${cursorPos.x * -70}px, ${cursorPos.y * -70}px) scale(1.05)` }}
        >
            {/* Some floating particles to enhance the atomic feel */}
            <div className="particle p1"></div>
            <div className="particle p2"></div>
            <div className="particle p3"></div>
            <div className="particle p4"></div>
            <div className="particle p5"></div>
        </div>

        {/* The Text Overlay */}
        <div className="text-overlay">
          <h1 className="headline">
            Discover the Hidden Code of <span className="highlight-text">Your World</span>
          </h1>
          <p className="subheadline">
            Chemistry isn't just in textbooks. It's the superpower running the universe.
          </p>
          <button className="hero-cta" onClick={() => navigate('/lab')}>
            <Sparkles size={20} />
            Start Learning
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Scroll indicator */}
        <div className="scroll-indicator">
            <div className="mouse">
                <div className="wheel"></div>
            </div>
            <div className="arrows">
                <span className="arrow a1"></span>
                <span className="arrow a2"></span>
                <span className="arrow a3"></span>
            </div>
        </div>
      </section>

      {/* PHASE 5: The Sequential Learning Journey */}
      <section className="portals-section">
        <h2 className="portals-title">Your Learning Journey</h2>
        <p style={{ textAlign: 'center', color: '#71717a', marginTop: '-2rem', marginBottom: '3rem', fontSize: '1.1rem' }}>
          Follow these steps in order to master the foundation of chemistry.
        </p>
        
        <div className="portals-grid">
          
          {/* Step 1: The Building Blocks */}
          <div 
            className="portal-card" 
            onClick={() => navigate('/lab')}
          >
            <div className="step-badge">Step 1</div>
            {visitedSteps.includes(1) && <div className="step-check"><CheckCircle2 size={20} /></div>}
            <div className="portal-icon-container">
              <FlaskConical className="portal-icon text-indigo-400" size={48} />
              <div className="reaction-glow indigo"></div>
            </div>
            <h3 className="portal-heading">The Building Blocks</h3>
            <p className="portal-desc">Watch 3D animations that visualize atoms, metals, and bonding.</p>
            <div className="fizzing-particles"></div>
          </div>

          {/* Arrow connector */}
          <div className="journey-arrow">
            <ChevronRight size={32} />
          </div>

          {/* Step 2: Study Material */}
          <div 
            className="portal-card"
            onClick={() => navigate('/syllabus')}
          >
            <div className="step-badge">Step 2</div>
            {visitedSteps.includes(2) && <div className="step-check"><CheckCircle2 size={20} /></div>}
            <div className="portal-icon-container">
              <Beaker className="portal-icon text-emerald-400" size={48} />
              <div className="reaction-glow emerald"></div>
            </div>
            <h3 className="portal-heading">Read & Learn</h3>
            <p className="portal-desc">Study the textbook content with exam tips &amp; key equations.</p>
            <div className="fizzing-particles"></div>
          </div>

          {/* Arrow connector */}
          <div className="journey-arrow">
            <ChevronRight size={32} />
          </div>

          {/* Step 3: The Master Roster */}
          <div 
            className="portal-card"
            onClick={() => navigate('/periodic-table')}
          >
            <div className="step-badge">Step 3</div>
            {visitedSteps.includes(3) && <div className="step-check"><CheckCircle2 size={20} /></div>}
             <div className="portal-icon-container">
              <Atom className="portal-icon text-purple-400" size={48} />
              <div className="reaction-glow purple"></div>
            </div>
            <h3 className="portal-heading">The Master Roster</h3>
            <p className="portal-desc">Explore all 118 elements in the Periodic Table.</p>
            <div className="fizzing-particles"></div>
          </div>

        </div>
      </section>
    </div>
  );
};
