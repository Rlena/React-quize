import React from 'react'
import './AnswerItem.css'

// в props параметры для компонента
const AnswersItem = props => {

  const cls = ['AnswersItem']

  if(props.state) {
    // в props.state лежит либо success либо error
    cls.push(props.state)

  }

  return (
    <li
      className={cls.join(' ')}
      onClick={() => props.onAnswerClick(props.answer.id)}
    >
      { props.answer.text }
    </li>
  )
}

export default AnswersItem