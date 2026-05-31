import ProjectCard from '@/components/ProjectCard';

const projects = [
  {
    title: 'Hausa NLP Library',
    description: 'A comprehensive Python library for processing the Hausa language, including tokenization, stemming, and named entity recognition.',
    imageUrl: '/placeholder.svg',
    projectUrl: '#',
    tags: ['Python', 'NLP', 'Hausa'],
  },
  {
    title: 'Multilingual Chatbot for Healthcare',
    description: 'An AI-powered chatbot that provides healthcare information in multiple African languages, improving accessibility for rural communities.',
    imageUrl: '/placeholder.svg',
    projectUrl: '#',
    tags: ['AI', 'Chatbot', 'Healthcare'],
  },
  {
    title: 'African Language Translation Model',
    description: 'A neural machine translation model trained on a custom dataset of African languages, enabling high-quality translations between languages like Yoruba, Swahili, and English.',
    imageUrl: '/placeholder.svg',
    projectUrl: '#',
    tags: ['Machine Learning', 'Translation', 'Yoruba'],
  },
];

const ProjectsPage = () => {
  return (
    <section className="projects" id="projects">
      <div className="container">
        <div className="section-header" data-animate="fade-up">
          <span className="section-label">My Work</span>
          <h2 className="section-title">Featured Projects</h2>
        </div>
        <div className="projects-grid">
          {projects.map(project => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsPage;
