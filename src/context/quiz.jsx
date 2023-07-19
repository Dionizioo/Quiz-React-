import { createContext, useReducer } from "react";
import questions from "../data/questions_complete";

// Definição dos estágios do jogo
const STAGES = ["Start", "Category", "Playing", "End"];

// Estado inicial do quiz
const initialState = {
  gameStage: STAGES[0], // Define o estágio inicial como "Start"
  questions, // Armazena as perguntas importadas
  currentQuestion: 0, // Índice da pergunta atual
  answerSelected: false, // Flag indicando se uma resposta foi selecionada
  score: 0, // Pontuação atual do jogador
  help: false, // Flag indicando se a ajuda está ativada
  optionToHide: null, // Opção a ser ocultada na pergunta atual
};

console.log(initialState);

// Função reducer do quiz
const quizReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_STAGE":
      return {
        ...state,
        gameStage: STAGES[1], // Altera o estágio do jogo para "Category"
      };

    case "START_GAME":
      let quizQuestions = null;

      // Filtra as perguntas com base na categoria fornecida na ação
      state.questions.forEach((question) => {
        if (question.category === action.payload) {
          quizQuestions = question.questions;
        }
      });

      return {
        ...state,
        questions: quizQuestions, // Define as perguntas filtradas
        gameStage: STAGES[2], // Altera o estágio do jogo para "Playing"
      };

    case "REORDER_QUESTIONS":
      // Reordena as perguntas de forma aleatória
      const reorderedQuestions = state.questions.sort(() => {
        return Math.random() - 0.5;
      });

      return {
        ...state,
        questions: reorderedQuestions, // Define as perguntas reordenadas
      };

    case "CHANGE_QUESTION": {
      const nextQuestion = state.currentQuestion + 1;
      let endGame = false;

      if (!state.questions[nextQuestion]) {
        endGame = true;
      }

      return {
        ...state,
        currentQuestion: nextQuestion, // Atualiza a pergunta atual
        gameStage: endGame ? STAGES[3] : state.gameStage, // Altera o estágio do jogo para "End" se não houver próxima pergunta
        answerSelected: false, // Reinicia a seleção de resposta
        help: false, // Desativa a ajuda
      };
    }

    case "NEW_GAME": {
      console.log(questions);
      console.log(initialState);
      return initialState; // Reinicia o estado do jogo para o estado inicial
    }

    case "CHECK_ANSWER": {
      if (state.answerSelected) return state;

      const answer = action.payload.answer;
      const option = action.payload.option;
      let correctAnswer = 0;

      if (answer === option) correctAnswer = 1;

      return {
        ...state,
        score: state.score + correctAnswer, // Atualiza a pontuação com base na resposta correta
        answerSelected: option, // Marca a resposta selecionada
      };
    }

    case "SHOW_TIP": {
      return {
        ...state,
        help: "tip", // Ativa a ajuda exibindo uma dica
      };
    }

    case "REMOVE_OPTION": {
      const questionWithoutOption = state.questions[state.currentQuestion];

      console.log(state.currentQuestion);

      console.log(questionWithoutOption);

      let repeat = true;
      let optionToHide;

      // Itera sobre as opções da pergunta atual para encontrar uma opção diferente da resposta correta
      questionWithoutOption.options.forEach((option) => {
        if (option !== questionWithoutOption.answer && repeat) {
          optionToHide = option; // Define a opção a ser ocultada
          repeat = false;
        }
      });

      return {
        ...state,
        optionToHide, // Define a opção a ser ocultada
        help: true, // Ativa a ajuda
      };
    }

    default:
      return state;
  }
};

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const value = useReducer(quizReducer, initialState);

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
