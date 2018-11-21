import React, { Component } from 'react'
import './Quiz.css'
import ActiveQuiz from '../../components/ActiveQuiz/ActiveQuiz'
import FinishedQuiz from '../../components/FinishedQuiz/FinishedQuiz'
import Loader from "../../components/UI/Loader/Loader"
import { connect } from "react-redux"
import { fetchQuizById, quizAnswerClick, retryQuiz } from "../../store/actions/quiz";

class Quiz extends Component {

  async componentDidMount() {
    // console.log('Quiz Id = ', this.props.match.params.id)
    this.props.fetchQuizById(this.props.match.params.id)
  }

  // вызывается, когда компонент унитожается
  // при закрытии компонента с вопросом нужно обнулить state
  // при выходе со страницы диспатчим новый action type
  componentWillUnmount() {
    this.props.retryQuiz()
  }

  render() {
    console.log(this.props)
    return (
      <div className={'Quiz'}>
        <div className={'QuizWrapper'}>
          <h1>Ответьте на все вопросы</h1>

          {
            // идет загрузка или нет параметра props.quiz
            this.props.loading || !this.props.quiz
            ? <Loader />
            : this.props.isFinished
              ? <FinishedQuiz
                results={this.props.results}
                quiz={this.props.quiz} // доступ к вопросам
                onRetry={this.props.retryQuiz}
              />
              : <ActiveQuiz
                answers={this.props.quiz[this.props.activeQuestion].answers}
                question={this.props.quiz[this.props.activeQuestion].question}
                onAnswerClick={this.props.quizAnswerClick}
                quizLength={this.props.quiz.length}
                answerNumber={this.props.activeQuestion + 1}
                state={this.props.answerState}
              />
          }

        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    results: state.quiz.results,
    isFinished: state.quiz.isFinished,
    activeQuestion: state.quiz.activeQuestion,
    answerState: state.quiz.answerState,
    quiz: state.quiz.quiz,
    loading: state.quiz.loading
  }
}

// методы для реализации страницы
function mapDispatchToProps(dispatch) {
  return {
    fetchQuizById: id => dispatch(fetchQuizById(id)),
    quizAnswerClick: answerId => dispatch(quizAnswerClick(answerId)),
    retryQuiz: () => dispatch(retryQuiz())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Quiz)