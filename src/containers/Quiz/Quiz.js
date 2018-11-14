import React, { Component } from 'react'
import './Quiz.css'
import ActiveQuiz from '../../components/ActiveQuiz/ActiveQuiz'
import FinishedQuiz from '../../components/FinishedQuiz/FinishedQuiz'

class Quiz extends Component {
  state = {
    results: {}, // {[id]: 'success' 'error}
    isFinished: false,
    activeQuestion: 0,
    answerState: null, // текущий клик пользователя, объект {[id]: 'success' 'error}
    quiz: [
      {
        question: 'Какого цвета небо?',
        rightAnswerID: 2,
        id: 1,
        answers: [
          { text: 'Черный', id: 1 },
          { text: 'Синий', id: 2 },
          { text: 'Красный', id: 3 },
          { text: 'Зеленый', id: 4 }
        ]
      },
      {
        question: 'В каком году основали Санкт-Петербург?',
        rightAnswerID: 3,
        id: 2,
        answers: [
          { text: '1700', id: 1 },
          { text: '1702', id: 2 },
          { text: '1703', id: 3 },
          { text: '1803', id: 4 }
        ]
      }
    ]
  }

  onAnswerClickHandler = answerId => {
    // console.log('Answer Id:', answerId)

    // если у нас есть правильный ответ, то мы не будем позволять обрабатывать клики
    // и будем жадать пока переключится ответ
    if (this.state.answerState) {
      // если в answerState уже есть правильный ответ, мы не должны выполнять данную функцию
      // answerState - объект, с рандомным id, который мы задаем сами
      // вытаскиваем состояние данного ключа и кладем в нее значение через Object.keys
      // из this.state.answerState забрать 0 элемент, потому что мы знаем, что в объекте будет только 1 значение
      const key = Object.keys(this.state.answerState)[0]

      if (this.state.answerState[key] === 'success') {
        // если правильно ответили на вопрос, в функцию не заходим
        return
      }
    }

    // question - текущий id
    const question = this.state.quiz[this.state.activeQuestion]
    const results = this.state.results

    // если правильно ответили на вопрос
    if (question.rightAnswerID === answerId) {
      // если в объекте results уже что-то лежит, а лежать там может только error,
      // т.к. мы могли уже заходить и неправильно ответить на вопрос
      if (!results[question.id]) {
        results[question.id] = 'success'
      }

      this.setState({
        answerState: { [answerId]: 'success' },
        results
      })

      const timeout = window.setTimeout(() => {
        // если голосование окончено
        if (this.isQuizFinished()) {
          this.setState({
            isFinished: true
          })
        }
        // иначе переключать на следующий вопрос
        else {
          this.setState({
            activeQuestion: this.state.activeQuestion + 1,
            answerState: null // если правильно ответили на вопрос обнуляем answerState
          })
        }
        window.clearTimeout(timeout)
      }, 1000)

    }
    // если ответили неправильно
    else {
      // такой id теперь неправильный
      results[question.id] = 'error'
      this.setState({
        answerState: { [answerId]: 'error' },
        results: results // можно написать просто results, т.к. ключ и значение совпадают
      })
    }
  }

  isQuizFinished() {
    return this.state.activeQuestion + 1 === this.state.quiz.length
  }

  retryHandler = () => {
    // обнуляем state
    this.setState({
      activeQuestion: 0,
      answerState: null,
      isFinished: false,
      results: {}
    })
  }

  render() {
    return (
      <div className={'Quiz'}>
        <div className={'QuizWrapper'}>
          <h1>Ответьте на все вопросы</h1>

          {
            this.state.isFinished
              ? <FinishedQuiz
                results={this.state.results}
                quiz={this.state.quiz} // доступ к вопросам
                onRetry={this.retryHandler}
              />
              : <ActiveQuiz
                answers={this.state.quiz[this.state.activeQuestion].answers}
                question={this.state.quiz[this.state.activeQuestion].question}
                onAnswerClick={this.onAnswerClickHandler}
                quizLength={this.state.quiz.length}
                answerNumber={this.state.activeQuestion + 1}
                state={this.state.answerState}
              />
          }
        </div>
      </div>
    )
  }
}

export default Quiz