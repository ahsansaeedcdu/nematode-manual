import "./AZFilter.css";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function AZFilter({ onLetterClick }) {
  return (
    <div className="az-filter">
      {letters.map((letter) => (
        <button
          key={letter}
          className="az-button"
          onClick={() => onLetterClick(letter)}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}

export default AZFilter;
