// rootReducer объединяет все существующие в приложении reducers
import {combineReducers} from 'redux'
import quizReducer from './quiz'
import createReducer from './create' // импорт нового редюсера

// передаем объект конфигурации, описывающий все reducers
export default combineReducers({
  // новый state в store
  quiz: quizReducer,
  create: createReducer // регистрация нового редюсера
})