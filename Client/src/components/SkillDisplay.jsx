import "./Profile.css";

function SkillDisplay({ skill, setSkills }) {
  return (
    <div className="skill">
      <span>{skill}</span>

      <span
        className="remove-button"
        onClick={() => {
          setSkills((prev) =>
            prev.filter((s) => s !== skill)
          );
        }}
      >
        X
      </span>
    </div>
  );
}

export default SkillDisplay;