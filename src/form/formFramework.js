// принимает конфигурацию и набор правил валидации
// возвращает объект
export function createControl(config, validation) {
  return {
    // развертка объекта конфигурации со всеми полями
    ...config,

    // объект validation
    validation,

    // если мы передали какой-то набор правил валидации, то начальное значение valid будет false
    // т.е. начальное его значение невалидное
    valid: !validation,
    touched: false,
    value: ''
  }
}

// определение валидности
// принимает value и набор правил валидации
export function validate(value, validation = null) {
  // если нет параметрова валидации
  if (!validation) {
    return true
  }

  let isValid = true

  // если есть такое требование к валидации
  if (validation.required) {
    isValid = value.trim() !== '' && isValid
  }

  return isValid
}

export function validateForm(formControls) {

}