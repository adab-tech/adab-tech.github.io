'use client';

import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar" id="navbar" aria-label="Main navigation">
      <div className="nav-container">
        <Link href="/" className="nav-brand">
          <span className="brand-name">Adamu Abubakar</span>
          <span className="brand-tagline">Computational Linguist</span>
        </Link>
        
        <button 
          type="button" 
          className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`} 
          id="mobileMenuToggle" 
          aria-label="Toggle mobile menu" 
          aria-expanded={isMenuOpen}
          onClick={() => setMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`} id="navMenu">
          <Link href="/" className="nav-link" aria-current="page">Home</Link>
          <Link href="/about" className="nav-link">About</Link>
          <Link href="/projects" className="nav-link">Projects</Link>
          <Link href="/skills" className="nav-link">Skills</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
          
          <button 
            type="button" 
            className="theme-toggle" 
            id="themeToggle" 
            aria-label="Toggle dark mode" 
            aria-pressed={theme === 'dark'}
            onClick={toggleTheme}
          >
            <svg className="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg className="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
