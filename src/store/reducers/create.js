// reducer для компонента QuizCreator

import { CREATE_QUIZ_QUESTION, RESET_QUIZ_CREATION } from "../actions/actionTypes"

const initialState = {
  quiz: []
}

export default function createReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_QUIZ_QUESTION:
      return {
        // возвращаем обновленный state, в массив quiz нужно обавить новый элемент item,
        // кот. мы передаем в качестве параметра у action (actions/create)
        // чтобы не мутировать массив, а создать новый, в качестве параметра quiz получаем новый массив
        // далее разворачиваем массив quiz и добавляем к нему новый элемент action.item
        ...state,
        quiz: [...state.quiz, action.item]
      }
    case RESET_QUIZ_CREATION:
      return {
        // вернем обновленный state и обнулим массив quiz
        ...state, quiz: []
      }
    default:
      return state
  }
}
