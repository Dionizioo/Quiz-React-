import { useContext } from "react";
import { QuizContext } from "../context/quiz";
import "./PickCategory.css";

import Scream from "../img/scream.svg";
import Perso from "../img/perso.png";
import Cris from "../img/cristin.jpg";

const PickCategory = () => {
  const [quizState, dispatch] = useContext(QuizContext);

  function chooseCategoryAndReorderQuestions(category) {
    dispatch({ type: "START_GAME", payload: category });
    dispatch({ type: "REORDER_QUESTIONS" });
  }

  return (
    <div id="category">
      <h2>Escolha uma categoria</h2>
      <p>As perguntas serão referentes a uma das linguagens abaixo:</p>
      <div className="category-item">
        {quizState.questions.map((question, index) => (
          <div key={question.category} className="category-button">
            <button
              onClick={() => chooseCategoryAndReorderQuestions(question.category)}
            >
              <img
                src={
                  index === 0
                    ? Scream
                    : index === 1
                    ? Perso
                    : Cris
                }
                alt="Categoria do Quiz"
                className="category-image-left"
              />
              {question.category}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PickCategory;
