// получение массива ответов и вывод их на экран
import React from 'react'
import './AnswersList.css'
import AnswerItem from './AnswerItem/AnswerItem'

// в props мы будем получать массив, по кот. выведем список всех элементов
const AnswersList = props => {
  return (
    <ul className={'AnswersList'}>
      {props.answers.map((answer, index) => {
        return (
          <AnswerItem
            key={index}
            answer={answer}
            onAnswerClick={props.onAnswerClick}
            state={props.state ? props.state[answer.id] : null}
          />
        )
      })}
    </ul>
  )
}

export default AnswersList