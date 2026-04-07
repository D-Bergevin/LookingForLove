import "./ProfileTest.css";

function InterestDisplay({ interest, setInterests }) {
  return (
    <div className="interest">
      <span>{interest}</span>

      <span
        className="remove-button"
        onClick={() => {
          setInterests((prev) =>
            prev.filter((i) => i !== interest)
          );
        }}
      >
        X
      </span>
    </div>
  );
}

export default InterestDisplay;