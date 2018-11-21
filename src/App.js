import React, { Component } from 'react';
import Layout from './hoc/Layout/Layout'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import Quiz from './containers/Quiz/Quiz'
import QuizList from './containers/QuizList/QuizList'
import Auth from './containers/Auth/Auth'
import QuizCreator from './containers/QuizCreator/QuizCreator'
import { connect } from 'react-redux'
import Logout from './components/Logout/Logout'

class App extends Component {

  // при попадании в компонент, будем вызывать функцию автологин
  // если у нас что-то хранится в local storage, будем автоматически подерживать нашу сессию
  componentDidMount() {
    this.props.authLogin()
  }

  render() {

    // на основе параметра isAuthenticated определяем какие роуты показывать, а какие нет
    // если не авторизованы
    let routes = (
      // Switch позволяет загружать только 1 нужный роут
      <Switch>
        <Route path="/auth" component={Auth} />

        {/* динамический id для определенного теста или опроса */}
        <Route path="/quiz/:id" component={Quiz} />
        <Route path="/" component={QuizList} />
        <Redirect to='/' />
      </Switch>
    )

    // пользователь авторизован в системе, переопределяем переменную routes на другой jsx
    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/quiz-creator" component={QuizCreator} />
          <Route path="/quiz/:id" component={Quiz} />
          <Route path="/" component={QuizList} />
          <Route path="/logout" component={Logout} />
          <Redirect to='/' />
        </Switch>
      )
    }

    return (

      <Layout>
        {routes}
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    // тут определяем авторизован пользователь или нет
    // если токен есть, пользователь авторизован
    isAuthenticated: !!state.auth.token
  }
}

// реализация автологина
function mapDispatchToProps(dispatch) {
  return {
    authLogin: () => dispatch(autoLogin())
  }

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
