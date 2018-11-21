// в данном компоненте отрисосываем элементы на основе того, что прилетело с сервера

import React, { Component } from 'react'
import './QuizList.css'
import { NavLink } from 'react-router-dom'
import Loader from '../../components/UI/Loader/Loader'
import { connect } from "react-redux" // для взаимодействия react-redux
import { fetchQuizes } from "../../store/actions/quiz";

class QuizList extends Component {

  renderQuizes() {
    // quizes здесь получаем как параметр
    return this.props.quizes.map(quiz => {
      return (
        <li
          key={quiz.id}
        >
          <NavLink to={'/quiz/' + quiz.id}>
            {quiz.name}
          </NavLink>
        </li>
      )
    })
  }

  // загрузка всех тестов
  componentDidMount() {
    // обращаемся к текущим параметрам и вызываем метод fetchQuizes
    this.props.fetchQuizes()
  }

  render() {
    return (
      <div className={'QuizList'}>
        <div>
          <h1>Список тестов</h1>

          {
            this.props.loading && this.props.quizes.length !== 0
              ? <Loader />
              : <ul>
                  {this.renderQuizes()}
                </ul>
          }

        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    quizes: state.quiz.quizes,
    loading: state.quiz.loading
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // говорим компоненту, что ему нужно загрузить какой-то набор тестов
    // fetchQuizes диспатчит action creator fetchQuizes()
    // теперь в props есть функция fetchQuizes, которая реализована в actions/quiz.js
    fetchQuizes: () => dispatch(fetchQuizes())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizList)