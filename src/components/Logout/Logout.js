import React, {Component} from 'react'
import { connect } from "react-redux";
import {Redirect} from 'react-router-dom'
import { logout } from "../../store/actions/auth";

class Logout extends Component {
  // после инициализации данного компонента нужно задиспатчить функцию logout
  componentDidMount() {
    this.props.logout()
  }

  // делаем редирект
  render() {
    return <Redirect to={'/'} />
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logout())
  }
}

export default connect(null, mapDispatchToProps)(Logout)