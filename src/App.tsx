import { useState, useCallback, useEffect } from "react";

type Color = {
  name: string;
  hex: string;
};

const COLORS: Color[] = [
  { name: "czerwony", hex: "#FF0000" },
  { name: "niebieski", hex: "#0000FF" },
  { name: "zielony", hex: "#008000" },
  { name: "żółty", hex: "#eaea14" },
  { name: "różowy", hex: "#e373c9" },
  { name: "fioletowy", hex: "#690ab8" },
  { name: "pomarańczowy", hex: "#ff9100" },
  { name: "brązowy", hex: "#490808" },
  { name: "szary", hex: "#808080" },
  { name: "turkusowy", hex: "#40E0D0" },
];

const TOTAL_ROUNDS = 10;

const App = () => {
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [currentWord, setCurrentWord] = useState<Color>(COLORS[0]);
  const [currentColor, setCurrentColor] = useState<Color>(COLORS[1]);
  const [isCorrectAnswerOnRight, setIsCorrectAnswerOnRight] =
    useState<boolean>(false);
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);

  const generateNewRound = useCallback(() => {
    const wordIndex = Math.floor(Math.random() * COLORS.length);
    let colorIndex;

    do {
      colorIndex = Math.floor(Math.random() * COLORS.length);
    } while (colorIndex === wordIndex);

    setCurrentWord(COLORS[wordIndex]);
    setCurrentColor(COLORS[colorIndex]);
    // Losowo umieszczamy poprawną odpowiedź po lewej lub prawej stronie
    setIsCorrectAnswerOnRight(Math.random() > 0.5);
  }, []);

  const handleAnswer = useCallback(
    (selectedColor: Color) => {
      if (selectedColor.name === currentColor.name) {
        setCorrectAnswers((prev) => prev + 1);
      }

      if (currentRound === TOTAL_ROUNDS) {
        setTotalTime(Date.now() - startTime);
        setIsGameFinished(true);
      } else {
        setCurrentRound((prev) => prev + 1);
        generateNewRound();
      }
    },
    [currentColor, currentRound, generateNewRound, startTime]
  );

  const handleRestartGame = useCallback(() => {
    setCorrectAnswers(0);
    setCurrentRound(1);
    setIsGameFinished(false);
    setStartTime(Date.now());
    generateNewRound();
  }, [generateNewRound]);

  useEffect(() => {
    setStartTime(Date.now());
    generateNewRound();
  }, [generateNewRound]);

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (isGameFinished) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-4xl font-bold mb-8">Koniec gry!</h1>
          <div className="space-y-4 mb-8">
            <p className="text-3xl">
              Poprawne odpowiedzi: {correctAnswers} z {TOTAL_ROUNDS}
            </p>
            <p className="text-3xl">Całkowity czas: {formatTime(totalTime)}</p>
          </div>
          <button
            onClick={handleRestartGame}
            onKeyDown={(e) => e.key === "Enter" && handleRestartGame()}
            className="bg-blue-500 hover:bg-blue-600 text-white text-2xl font-bold py-6 px-8 rounded-lg transition-colors"
            aria-label="Zagraj ponownie"
            tabIndex={0}
          >
            Zagraj ponownie
          </button>
        </div>
      </div>
    );
  }

  const AnswerButton = ({ color }: { color: Color }) => (
    <button
      onClick={() => handleAnswer(color)}
      onKeyDown={(e) => e.key === "Enter" && handleAnswer(color)}
      className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 text-3xl font-bold py-8 px-8 rounded-lg transition-colors hover:bg-gray-50"
      aria-label={`Wybierz kolor ${color.name}`}
      tabIndex={0}
    >
      {color.name}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1
            className="text-6xl font-bold mb-12"
            style={{ color: currentColor.hex }}
          >
            {currentWord.name}
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {isCorrectAnswerOnRight ? (
            <>
              <AnswerButton color={currentWord} />
              <AnswerButton color={currentColor} />
            </>
          ) : (
            <>
              <AnswerButton color={currentColor} />
              <AnswerButton color={currentWord} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
