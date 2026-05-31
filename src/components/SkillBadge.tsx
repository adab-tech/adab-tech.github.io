type SkillBadgeProps = {
  name: string;
};

const SkillBadge = ({ name }: SkillBadgeProps) => {
  return (
    <div className="skill-badge" data-animate="fade-up">
      {name}
    </div>
  );
};

export default SkillBadge;
