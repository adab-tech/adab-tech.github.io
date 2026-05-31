'use client';

import Image from "next/image";
import { useGreeting } from '@/hooks/useGreeting';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';

const GREETINGS = [
  { text: 'Welcome', lang: 'en' },
  { text: 'Bienvenue', lang: 'fr' },
  { text: 'Ẹ káàbọ', lang: 'yo' },
  { text: 'Barka da zuwa', lang: 'ha' },
  { text: 'مرحبا', lang: 'ar' },
  { text: 'Bienvenido', lang: 'es' },
  { text: 'Willkommen', lang: 'de' },
  { text: 'Benvenuto', lang: 'it' },
  { text: 'स्वागत है', lang: 'hi' },
  { text: 'ようこそ', lang: 'ja' },
  { text: '欢迎', lang: 'zh' },
  { text: 'Добро пожаловать', lang: 'ru' },
  { text: 'Karibu', lang: 'sw' },
  { text: 'Bem-vindo', lang: 'pt' }
];

export default function Home() {
  const greeting = useGreeting(GREETINGS);
  useScrollAnimations();

  return (
    <section className="hero" id="home">
      <div className="hero-background">
        <div className="hero-gradient"></div>
        <div className="hero-pattern"></div>
      </div>
      
      <div className="container hero-content">
        <div className="hero-text" data-animate="fade-up">
          <div className="greeting-container">
            <h1 id="dynamic-greeting" className="greeting visible" aria-live="polite" lang={greeting.lang}>{greeting.text}</h1>
            <noscript>
              <h1 className="greeting-fallback">Welcome</h1>
            </noscript>
          </div>
          
          <h2 className="hero-title">
            I'm <span className="highlight">Adamu Abubakar</span>
          </h2>
          
          <p className="hero-subtitle">
            Computational Linguist & AI Researcher specializing in African Language Technology
          </p>
          
          <p className="hero-description">
            Building bridges between technology and African languages through NLP, machine learning, 
            and innovative AI solutions. Expert in Hausa language processing and multilingual systems.
          </p>
          
          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">
              <span>View My Work</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="#contact" className="btn btn-secondary">
              <span>Get in Touch</span>
            </a>
          </div>
        </div>
        
        <div className="hero-visual" data-animate="fade-left">
          <div className="hero-card floating">
            <div className="code-snippet">
              <div className="code-header">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
              <div className="code-body">
                <code>
                  <span className="comment"># African Language NLP</span><br />
                  <span className="keyword">def</span> <span className="function">analyze_hausa</span>(text):<br />
                  &nbsp;&nbsp;<span className="keyword">return</span> tokenize(text)<br />
                  <br />
                  <span className="comment"># Multilingual AI</span><br />
                  result = <span className="function">translate</span>(<br />
                  &nbsp;&nbsp;text=<span className="string">"Barka da zuwa"</span>,<br />
                  &nbsp;&nbsp;target=<span className="string">"en"</span><br />
                  )
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="scroll-indicator">
        <span>Scroll Down</span>
        <div className="scroll-arrow"></div>
      </div>
    </section>
  );
}
