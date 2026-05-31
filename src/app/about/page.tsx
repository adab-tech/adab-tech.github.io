const AboutPage = () => {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="section-header" data-animate="fade-up">
          <span className="section-label">About Me</span>
          <h2 className="section-title">Bridging Technology & African Languages</h2>
        </div>
        
        <div className="about-content">
          <div className="about-text" data-animate="fade-right">
            <p className="lead">
              I'm a computational linguist and AI researcher passionate about making technology 
              accessible to African language speakers through innovative NLP solutions.
            </p>
            
            <p>
              With expertise in natural language processing, machine learning, and African linguistics, 
              I develop tools and systems that understand, process, and generate African languages—particularly 
              Hausa. My work focuses on creating practical applications that serve real-world needs in 
              healthcare, education, and digital services.
            </p>
            
            <p>
              I specialize in building multilingual AI systems, developing language datasets, and creating 
              accessible technology solutions that preserve and promote African linguistic diversity in the 
              digital age.
            </p>
            
            <div className="about-stats">
              <div className="stat">
                <div className="stat-number">5+</div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="stat">
                <div className="stat-number">10+</div>
                <div className="stat-label">Languages</div>
              </div>
              <div className="stat">
                <div className="stat-number">15+</div>
                <div className="stat-label">Projects</div>
              </div>
            </div>
          </div>
          
          <div className="about-visual" data-animate="fade-left">
            <div className="language-showcase">
              <div className="language-item">
                <div className="language-icon">🗣️</div>
                <div className="language-name">Hausa</div>
              </div>
              <div className="language-item">
                <div className="language-icon">🌍</div>
                <div className="language-name">Yoruba</div>
              </div>
              <div className="language-item">
                <div className="language-icon">🔥</div>
                <div className="language-name">Swahili</div>
              </div>
              <div className="language-item">
                <div className="language-icon">💡</div>
                <div className="language-name">English</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
