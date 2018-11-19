import React, { Component } from 'react'
import './QuizCreator.css'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import Select from '../../components/UI/Select/Select'
import { createControl, validate, validateForm } from '../../form/formFramework'
import Auxiliary from '../../hoc/Auxiliary/Auxiliary'
import axios from '../../axios/axios-quiz'

function createOptionControl(number) {
  return createControl({
    label: `Вариант ${number}`,
    errorMessage: 'Значение не может быть пустым',
    id: number
  }, { required: true })
}

// обнуление formControls
// вернет набор сгенерированных объектов
function createFormControls() {
  return {
    question: createControl({
      label: 'Введите вопрос',
      errorMessage: 'Вопрос не может быть пустым'
    }, { required: true }),
    option1: createOptionControl(1),
    option2: createOptionControl(2),
    option3: createOptionControl(3),
    option4: createOptionControl(4)
  }
}

export default class QuizCreator extends Component {

  state = {
    quiz: [],
    isFormValid: false,
    rightAnswerId: 1,
    formControls: createFormControls()
  }

  submitHandler = event => {
    event.preventDefault()
  }

  addQuestionHandler = event => {
    event.preventDefault()

    // создаем локальную копию массива quiz
    const quiz = this.state.quiz.concat()

    const index = quiz.length + 1

    const {question, option1, option2, option3, option4} = this.state.formControls

    // сформитровать объект каждого из вопросов и положить его в массив quiz
    const questionItem = {
      question: question.value,
      id: index,
      rightAnswerId: this.state.rightAnswerId,
      answers: [
        { text: option1.value, id: option1.id },
        { text: option2.value, id: option2.id },
        { text: option3.value, id: option3.id },
        { text: option4.value, id: option4.id }
      ]
    }

    quiz.push(questionItem)

    // страница будет чистая, но в массиве quiz уже будет что-то находиться
    this.setState({
      quiz,
      isFormValid: false,
      rightAnswerId: 1,
      formControls: createFormControls()
    })

  }

  createQuizHandler = async event => {
    event.preventDefault()
    // console.log(this.state.quiz)

    try {
      // axios возвращает промис
      // с помощью await распарсим промис
      // catch ловит ошибки
      // базовый url выведен в отдельную директорию axios/axios-quiz
      await axios.post('/quizes.json', this.state.quiz)
      // в случае положительного ответа

      this.setState({
        quiz: [],
        isFormValid: false,
        rightAnswerId: 1,
        formControls: createFormControls()
      })

    } catch (e) {
        // в случае ошибки
        console.log(e)
    }
  }

  // сконировать state, проверить валидацию для инпутов и изменить их значение
  changeHandler = (value, controlName) => {
    const formControls = {...this.state.formControls}
    const control = {...formControls[controlName]}

    // т.к. мы что-то поменяли
    control.touched = true

    // control.value меняем на value, кот. получаем в функцию
    control.value = value

    control.valid = validate(control.value, control.validation)

    // в локальную копию formControls по имени controlName заносим новое значение control
    formControls[controlName] = control

    this.setState({
      formControls,
      isFormValid: validateForm(formControls)
    })

  }

  renderControls() {
    // с пом. Object.keys получаем массив ключей объекта formControls
    return Object.keys(this.state.formControls).map((controlName, index) => {
      // в control попадет объект question либо option1, либо option2...
      const control = this.state.formControls[controlName]

      return (
        <Auxiliary key={controlName + index}>
          <Input
            label={control.label}
            value={control.value}
            valid={control.valid}
            shouldValidate={!!control.validation}
            touched={control.touched}
            errorMessage={control.errorMessage}
            onChange={event => this.changeHandler(event.target.value, controlName)}
          />

          {/* добавление гориз. черты после 1-го инпута*/}
          {index === 0 ? <hr /> : null}
        </Auxiliary>
      )
    })
  }

  selectChangeHandler = event => {
    // console.log(event.target.value)
    this.setState({
      rightAnswerId: +event.target.value // приводим к числу
    })
  }

  render() {

    const select = <Select
      label="Выберете правильный ответ"
      value={this.state.rightAnswerId}
      onChange={this.selectChangeHandler}
      options={[
        {text: 1, value: 1},
        {text: 2, value: 2},
        {text: 3, value: 3},
        {text: 4, value: 4}
      ]}
    />

    return (
      <div className={'QuizCreator'}>
        <div>
          <h1>Создание теста</h1>
          {/* отмена стандартного поведения формы */}
          <form onSubmit={this.submitHandler}>

            {/* рендер инпутов */}
            {this.renderControls()}

            { select }

            {/* кнопка будут disabled, если форма не валидная */}
            <Button
              type="primary"
              onClick={this.addQuestionHandler}
              disabled={!this.state.isFormValid}
            >
              Добавить вопрос
            </Button>

            {/* кнопка будет выключена, если нет вопросов в тесте */}
            <Button
              type="success"
              onClick={this.createQuizHandler}
              disabled={this.state.quiz === 0}
            >
              Создать тест
            </Button>

          </form>
        </div>
      </div>
    )
  }
}