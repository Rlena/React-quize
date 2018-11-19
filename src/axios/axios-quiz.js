import axios from 'axios'

export default axios.create({
  baseURL: 'https://react-quiz-47217.firebaseio.com/'
})