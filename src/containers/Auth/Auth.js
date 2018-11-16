import React, { Component } from 'react'
import './Auth.css'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import is from 'is_js'

export default class Auth extends Component {

  state = {
    isFormValid: false,
    formControls: {
      email: {
        value: '',
        type: 'email',
        label: 'Email',
        errorMessage: 'Введите корректный email',
        valid: false, // по умолчанию input пустой
        touched: false,
        validation: {
          required: true,
          email: true
        }
      },
      password: {
        value: '',
        type: 'password',
        label: 'Пароль',
        errorMessage: 'Введите корректный пароль',
        valid: false, // по умолчанию input пустой
        touched: false,
        validation: {
          required: true,
          minLength: 6 // мин. кол-во символов в Firebase(для бэкэнда)
        }
      }
    }
  }

  loginHandler = () => {

  }

  reqisterHandler = () => {

  }

  // отмена стандартного поведения формы
  submitHandler = event => {
    event.preventDefault()
  }

  // принимает значение и набор параметров для валидации
  validateControl(value, validation) {
    // если не были переданы параметры для валидации, то и валидировать не нужно
    if (!validation) {
      return true
    }

    let isValid = true

    // на основе объекта конфигурации validation изменяем isValid
    if (validation.required) {
      // переопределеяем локальную переменную isValid
      // отсекаем лишние пробелы в строке value с пом. trim()
      // если оставшееся в value не равно пустой строке isValid останется true
      // && isValid для случаев, когда первая проверка пройдет, но до этого isValid уже была false
      isValid = value.trim() !== '' && isValid
    }

    if (validation.email) {
      isValid = is.email(value) && isValid
    }

    if (validation.minLength) {
      isValid = value.length >= validation.minLength && isValid
    }

    return isValid
  }

  // controlName - то поле, кот. сейчас меняется
  onChangeHandler = (event, controlName) => {
    // console.log(`${controlName}:`, event.target.value)

    // чтобы избежать мутацию, делаем копию объекта из state
    const formControls = {...this.state.formControls}

    // также создаем копию каждого контрола
    // control - это объект email{} или password{} со всеми полями из state
    const control = {...formControls[controlName]}

    // переопределение значений
    control.value = event.target.value

    // как только мы попали в изменение данного инпут, это означает, что пользователь уже что-то ввел
    control.touched = true

    // валидный ли контрол
    // нужно в valid положить true или false
    // создаем локальную функцию this.validateControl, передаем ей control.value - новое введенное значение
    // и объект control.validation, кот. позволяет понять как валидироват и конфигурировать объект
    control.valid = this.validateControl(control.value, control.validation)

    // обвновляем локальную копию formControls, т.к. в control получили новые значения
    formControls[controlName] = control

    // валидацию всей формы делаем в этом методе
    // и после того как получены все актуальные контролы со всеми актуальными значениями и полями валидации
    let isFormValid = true

    // нужно пройтись по всем объектам объекта formControls
    // и проверить каждый конрол на валидность
    // получаем ключи formControls ('email' или 'password')
    Object.keys(formControls).forEach(name => {
      // на каждой итерации переопределяем переменную isFormValid
      isFormValid = formControls[name].valid && isFormValid

    })

    // изменяем состояние объекта formControls
    this.setState({
      formControls, isFormValid
    })
  }

  // должна вернуть массив инпутов
  // массив инпутов должны получить из formControls
  // с пом. Object.keys получам ключи объекта formControls, в итоге будет массив из 'email' и 'password'
  // controlName будет или 'email' или 'password'
  renderInputs() {
    return Object.keys(this.state.formControls).map((controlName, index) => {
      // в control кладем объект, характерный для каждого из контролов, email{} или pasword{}
      const control = this.state.formControls[controlName]
      return (
        <Input
          key={controlName + index}
          type={control.type}
          value={control.value}
          valid={control.valid}
          touched={control.touched}
          label={control.label}
          shouldValidate={!!control.validation}
          errorMessage={control.errorMessage}
          onChange={event => this.onChangeHandler(event, controlName)}
        />
      )
    })
  }

  render() {
    return (
      <div className={'Auth'}>
        <div>
          <h1>Авторизация</h1>

          <form
            onSubmit={this.submitHandler}
            className={'AuthForm'}
          >

            {/* функция для рендера инпутов */}
            {this.renderInputs()}

            <Button
              type="success"
              onClick={this.loginHandler}
              disabled={!this.state.isFormValid}
            >
              Войти
            </Button>
            <Button
              type="primary"
              onClick={this.reqisterHandler}
              disabled={!this.state.isFormValid}
            >
              Зарегистрироваться
            </Button>
          </form>
        </div>
      </div>
    )
  }
}

