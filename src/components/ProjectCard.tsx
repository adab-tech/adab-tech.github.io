import Image from 'next/image';
import Link from 'next/link';

type ProjectCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  tags: string[];
};

const ProjectCard = ({ title, description, imageUrl, projectUrl, tags }: ProjectCardProps) => {
  return (
    <div className="project-card" data-animate="fade-up">
      <div className="project-image">
        <Image src={imageUrl} alt={title} width={400} height={250} />
      </div>
      <div className="project-info">
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description}</p>
        <div className="project-tags">
          {tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <Link href={projectUrl} className="btn btn-secondary">
          View Project
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
