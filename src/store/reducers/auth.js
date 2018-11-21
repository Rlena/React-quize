import { AUTH_LOGOUT, AUTH_SUCCESS } from "../actions/actionTypes"

const initialState = {
  token: null
}

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {
        // вернем новый state и token
        ...state, token: action.token
      }
    case AUTH_LOGOUT:
      return {
        // обнуляем token
        ...state, token: null
      }
    default:
      return state
  }
}