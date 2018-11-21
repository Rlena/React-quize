// компонент рендеринга ссылок

import React, { Component } from 'react'
import './Drawer.css'
import { NavLink } from 'react-router-dom'
import Backdrop from '../../UI/Backdrop/Backdrop'

class Drawer extends Component {
  // как параметр данному компоненту нужно передавать авторизованы мы в системе или нет
  // для этого компонент Layout соединить со стором
  // Layout является родителем для Drawer
  // получим от Layout параметр isAuthenticated

  clickHandler = () => {
    // функция закрытия меню, пришедшая в параметрах
    this.props.onClose()
  }

  renderLinks(links) {
    return links.map((link, index) => {
      return (
        <li key={index}>
          <NavLink
            to={link.to}
            exact={link.exact}
            activeClassName={'active'}
            onClick={this.clickHandler}
          >
            {link.label}
          </NavLink>
        </li>
      )
    })
  }

  render() {
    const cls = ['Drawer']

    // если меню закрыто
    if (!this.props.isOpen) {
      cls.push('close')
    }

    // сгенерируем набор ссылок, кот. нам нужны и передать их в метод renderLinks
    const links = [
      { to: '/', label: 'Список', exact: true }
    ]

    console.log('Auth', this.props.isAuthenticated)

    // если зарегистрированы в системе
    if (this.props.isAuthenticated) {
      links.push({ to: '/quiz-creator', label: 'Создать тест', exact: false })
      links.push({ to: '/logout', label: 'Выйти', exact: false })
    } else {
      links.push({ to: '/auth', label: 'Авторизация', exact: false })
    }

    return (
      <React.Fragment>
        <nav className={cls.join(' ')}>
          <ul>
            {this.renderLinks(links)}
          </ul>
        </nav>
        {this.props.isOpen ? <Backdrop onClick={this.props.onClose} /> : null}
      </React.Fragment>
    )
  }
}

export default Drawer