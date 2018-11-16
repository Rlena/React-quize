import React from 'react'
import './Input.css'

// из props нужны только некоторые значения, берем их через деструктуризацию
function isInvalid({valid, touched, shouldValidate}) {
  // если невалидный контрол и если мы должны его валидировать и если мы его уже потрогали
  // это означает, что он у нас невалидный
  return !valid && shouldValidate && touched
}

const Input = props => {

  // т.к. компонент универсальный, создаем свойство, кот. будет определять тип поля
  // определяться будет из параметра props.type или если тип не определен по умолчанию будет text
  const inputType = props.type || 'text'
  const cls = ['Input']

  // в htmlFor каждый раз будет генерироваться уникальная строка
  // для каждого input будет свое уникальное значение
  const htmlFor = `${inputType}-${Math.random()}`

  // если input невалиный, будем добавлять новый класс
  if (isInvalid(props)) {
    cls.push('invalid')
  }

  return (
    <div className={cls.join(' ')}>
      <label htmlFor={htmlFor}>{props.label}</label>

      {/* onChange чтобы следить за изменениями input */}
      <input
        type={inputType}
        id={htmlFor}
        value={props.value}
        onChange={props.onChange}
      />

      {/* для валидации формы */}
      {/* если нет errorMessage, выдается строка по умолчанию после || */}
      {
        isInvalid(props)
          ? <span>{props.errorMessage || 'Введите верное значение'}</span>
          : null
      }

    </div>
  )
}

export default Input