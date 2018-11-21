// reducers для quiz и quizList

// начальный state
import {
  FETCH_QUIZ_SUCCESS,
  FETCH_QUIZES_ERROR,
  FETCH_QUIZES_START,
  FETCH_QUIZES_SUCCESS,
  FINISH_QUIZ,
  QUIZ_NEXT_QUESTION,
  QUIZ_RETRY,
  QUIZ_SET_STATE
} from "../actions/actionTypes";

const initialState = {
  // state из компонента QuizList
  quizes: [],
  loading: false,
  error: null,
  // state из компонента Quiz
  results: {}, // {[id]: 'success' 'error}
  isFinished: false,
  activeQuestion: 0,
  answerState: null, // текущий клик пользователя, объект {[id]: 'success' 'error}
  quiz: null // будет загружен с сервера
}

// формирование reducer, меняющего state
export default function quizReducer(state = initialState, action) {
  switch (action.type) {
    // начали что-то загружать
    // передаем склонированный state и изменяем loading на true
    case FETCH_QUIZES_START:
      return {
        ...state, loading: true
      }
    // успешная загрузка
    // передаем склонированный state и изменяем loading на false, т.к. загрузка завершилась
    // в качестве payload передаем quizes, меняем его на action.quizes, кот. указывали в actions/quiz
    case FETCH_QUIZES_SUCCESS:
      return {
        ...state, loading: false, quizes: action.quizes
      }
    // в случае ошибки
    case FETCH_QUIZES_ERROR:
      return {
        ...state, loading: false, error: action.error
      }
    case FETCH_QUIZ_SUCCESS:
      return {
        // вернет новый state c параметром loading: false, quiz, кот. указавали в функции action creator (actions/quiz)
        ...state, loading: false, quiz: action.quiz
      }
    case QUIZ_SET_STATE:
      return {
        // конируем state, меняем ключ answerState на action.answerState и меняем результаты
        ...state, answerState: action.answerState, results: action.results
      }
    case FINISH_QUIZ:
      return {
        // вернет новый state, где будет поле isFinished в значении true
        ...state, isFinished: true
      }
    case QUIZ_NEXT_QUESTION:
      return {
        // разворачиваем state, меняем параметр answerState на null, activeQuestion меняем на тот, кот. пришел с action
        // number указавали в функции action creator (actions/quiz)
        ...state, answerState: null, activeQuestion: action.number
      }
    case QUIZ_RETRY:
      return {
        // разворачиваем state и обнуляем значения
        ...state,
        activeQuestion: 0,
        answerState: null,
        isFinished: false,
        results: {}
      }
    default:
      return state
  }
}