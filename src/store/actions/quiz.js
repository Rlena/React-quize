// реализация всех action creator, которые нужны для тестов

import axios from '../../axios/axios-quiz'
import {
  FETCH_QUIZ_SUCCESS,
  FETCH_QUIZES_ERROR,
  FETCH_QUIZES_START,
  FETCH_QUIZES_SUCCESS,
  FINISH_QUIZ,
  QUIZ_NEXT_QUESTION,
  QUIZ_RETRY,
  QUIZ_SET_STATE
} from "./actionTypes";

// асинхронное событие
export function fetchQuizes() {
  // возвращает новую функцию, кот. принимает в себя параметр dispatch
  return async dispatch => {
    // диспатчим action creator, чтобы загрузить список
    // начали что-то загружать
    // далее получили какой-то ответ от сервера
    // поле того как ответ получили и трансформировали объекты через Object.keys и forEach
    // делаем новый диспатч dispatch(fetchQuizesSucces())
    dispatch(fetchQuizesStart())

    // try/catch для отлова ошибок
    try {
      // ответ с сервера положим в переменную response
      const response = await axios.get('/quizes.json')

      const quizes = []

      Object.keys(response.data).forEach((key, index) => {
        quizes.push({
          id: key,
          name: `Тест №${index + 1}`
        })
      })

      // сюда передаем параметры, которые сформировали, массив quizes, кот. мы трансформировали для нашего компонента
      dispatch(fetchQuizesSuccess(quizes))

    } catch (e) {
      // в случае ошибки диспатчим новый action creator
      dispatch(fetchQuizesError(e))
      console.log(e)
    }
  }
}

export function fetchQuizById(quizId) {
  // возвращает асинхсронную функцию dispatch, в кот. описана логика загрузки теста по id
  return async dispatch => {
   // изменить state на loading
   // метод fetchQuizesStart (описана в reducers/quiz) меняет loading с false на true
    dispatch(fetchQuizesStart())
    // логика по загрузки теста
    try {
      const response = await axios.get(`/quizes/${quizId}.json`)
      const quiz = response.data // тест. кот. мы получили

      dispatch(fetchQuizSuccess(quiz))
    } catch (e) {
      // fetchQuizesError останавливает загрузку и добавляет параметр error
      dispatch(fetchQuizesError(e))
    }
  }
}

export function fetchQuizSuccess(quiz) {
  return {
    type: FETCH_QUIZ_SUCCESS,
    quiz
  }
}

// реализация функций actions creator
export function fetchQuizesStart() {
  return {
    // type берем из констант в actionTypes
    // в случае вызова метода fetchQuizesStart, дипатчим объект с типом FETCH_QUIZES_START
    type: FETCH_QUIZES_START
  }
}

// при успешной загрузки с сервера
export function fetchQuizesSuccess(quizes) {
  return {
    type: FETCH_QUIZES_SUCCESS,
    // как payload указываем quizes
    quizes
  }
}

// в случае ошибки
export function fetchQuizesError(e) {
  return {
    type: FETCH_QUIZES_ERROR,
    error: e
  }
}

export function quizSetState(answerState, results) {
  return {
    type: QUIZ_SET_STATE,
    answerState, results
  }
}

export function finishQiuz() {
  return {
    type: FINISH_QUIZ
  }
}

export function quizNextQuestion(number) {
  return {
    type: QUIZ_NEXT_QUESTION,
    number
  }
}

// обнуление текущего state
export function retryQuiz() {
  return {
    type: QUIZ_RETRY
  }
}

export function quizAnswerClick(answerId) {
  return (dispatch, getState) => {
    // с помощью функции getState получаем state и нас интересует поле quiz
    const state = getState().quiz

    // если у нас есть правильный ответ, то мы не будем позволять обрабатывать клики
    // и будем жадать пока переключится ответ
    if (state.answerState) {
      // если в answerState уже есть правильный ответ, мы не должны выполнять данную функцию
      // answerState - объект, с рандомным id, который мы задаем сами
      // вытаскиваем состояние данного ключа и кладем в нее значение через Object.keys
      // из this.state.answerState забрать 0 элемент, потому что мы знаем, что в объекте будет только 1 значение
      const key = Object.keys(state.answerState)[0]
      if (state.answerState[key] === 'success') {
        // если правильно ответили на вопрос, в функцию не заходим
        return
      }
    }

    // question - текущий id
    const question = state.quiz[state.activeQuestion]
    const results = state.results

    // если правильно ответили на вопрос
    if (question.rightAnswerId === answerId) {
      // если в объекте results уже что-то лежит, а лежать там может только error,
      // т.к. мы могли уже заходить и неправильно ответить на вопрос
      if (!results[question.id]) {
        results[question.id] = 'success'
      }

      dispatch(quizSetState({ [answerId]: 'success' }, results))

      // завершение теста и показ другого компонента
      const timeout = window.setTimeout(() => {
        // если голосование окончено
        // в isQuizFinished передаем state кот. был определен выше
        if (isQuizFinished(state)) {
          dispatch(finishQiuz())
        }
        // иначе переключать на следующий вопрос
        else {
          // в quizNextQuestion передаем текущий вопрос и увеличиваем его на 1
          dispatch(quizNextQuestion(state.activeQuestion + 1))
        }
        window.clearTimeout(timeout)
      }, 1000)

    }
    // если ответили неправильно
    else {
      // такой id теперь неправильный
      results[question.id] = 'error'

      dispatch(quizSetState({ [answerId]: 'error' }, results)) // results ключ и значение совпадают
    }

  }
}

// принимает state и возвращает данный state и то условие, кот. прописывали
export function isQuizFinished(state) {
  return state.activeQuestion + 1 === state.quiz.length
}

// после реализации actions creator можем перейти к reducer