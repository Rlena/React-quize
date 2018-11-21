import axios from 'axios'
import { AUTH_LOGOUT, AUTH_SUCCESS } from "./actionTypes";

export function auth(email, password, isLogin) {
  // возвращаем асинхронный диспатч, т.к. будем делать запрос к серверу
  return async dispatch => {

    // необходимые поля для POST-запроса авторизации
    // docs Sign up with email / password (Firebase Auth REST API)
    // формируем authData (запрос), email и password приходят как параметры в функцию
    const authData = {
      email,
      password,
      returnSecureToken: true
    }

    // на данном этапе определяем какой запрос нужно делать на авторизацию или регистрацию

    // если регистрация
    let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCaaQm6AuGS4nFSCDkJgqyOosYsj0RXm8E'

    // если авторизация, то в url записываем ссылку входа в систему
    if (isLogin) {
      url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCaaQm6AuGS4nFSCDkJgqyOosYsj0RXm8E'
    }

    const response = await axios.post(url, authData)
    const data = response.data
    // console.log(data);

    // обработать expiration data
    // такие токены обычно выдаются на час (3600 сек.)
    // поэтому нужно проверять, если час прошел, нужно закончить сессию и получить новый токен, заново авторизоваться
    // получаем текущий тайм-штамп
    const expirationData = new Date(new Date().getTime() + data.expiresIn * 1000)

    // для поддержания сессии, токен, кот. мы получили от сервера положить в local storage, чтобы иметь к нему доступ
    localStorage.setItem('token', data.idToken)

    // занести локальный id пользователя
    localStorage.setItem('userId', data.localId)

    localStorage.setItem('expirationData', expirationData)

    // диспатч нового события с параметром data.idToken чтобы поддерживать текущую сессию
    dispatch(authSuccess(data.idToken))

    // реализация авто логаута т.к. через час сессия завершится
    // делаем новый диспатч autoLogout, передаем параметр expiresIn
    dispatch(autoLogout(data.expiresIn))
  }
}

// разлогин через определенное время
export function autoLogout(time) {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout())
    }, time * 1000)
  }
}

// разлогин, очистка local storage
export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  localStorage.removeItem('expirationData')
  return {
    type: AUTH_LOGOUT
  }
}

export function autoLogin() {
  
}

export function authSuccess(token) {
  return {
    type: AUTH_SUCCESS,
    token
  }
  
} 