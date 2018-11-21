// rootReducer объединяет все существующие в приложении reducers
import {combineReducers} from 'redux'
import quizReducer from './quiz' // импорт нового редюсера
import createReducer from './create'
import authReducer from './auth'

// передаем объект конфигурации, описывающий все reducers
export default combineReducers({
  // новый state в store
  quiz: quizReducer, // регистрация нового редюсера
  create: createReducer,
  auth: authReducer
})