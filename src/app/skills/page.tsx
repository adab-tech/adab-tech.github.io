import SkillBadge from '@/components/SkillBadge';

const skills = [
  'Natural Language Processing (NLP)',
  'Machine Learning',
  'Python',
  'TensorFlow',
  'PyTorch',
  'Scikit-learn',
  'Hugging Face',
  'NLTK',
  'SpaCy',
  'JavaScript',
  'React',
  'Next.js',
  'Node.js',
  'SQL',
  'Docker',
  'Git',
];

const SkillsPage = () => {
  return (
    <section className="skills" id="skills">
      <div className="container">
        <div className="section-header" data-animate="fade-up">
          <span className="section-label">My Expertise</span>
          <h2 className="section-title">Skills & Technologies</h2>
        </div>
        <div className="skills-grid">
          {skills.map(skill => (
            <SkillBadge key={skill} name={skill} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsPage;
