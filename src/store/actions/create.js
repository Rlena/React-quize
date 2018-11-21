// реализация всех action creator для компонента QuizCreactor
// наименования функций соответствуют описанным в QuizCreactor mapDispatchToProps
import { CREATE_QUIZ_QUESTION, RESET_QUIZ_CREATION } from "./actionTypes"
import axios from "../../axios/axios-quiz";

export function createQuizQuestion(item) {
  return {
    type: CREATE_QUIZ_QUESTION,
    item
  }
}

// обнуление массива quiz для создания нового теста
export function resetQuizCreation() {
  return {
    type: RESET_QUIZ_CREATION
  }
}

export function finishCreateQuiz() {
  return async (dispatch, getState) => {
    // axios возвращает промис
    // с помощью await распарсим промис
    // catch ловит ошибки
    // базовый url выведен в отдельную директорию axios/axios-quiz
    // получаем state из параметра getState из reducers/create
    await axios.post('/quizes.json', getState().create.quiz)
    // диспатчим resetQuizCreation
    dispatch(resetQuizCreation())
  }
}