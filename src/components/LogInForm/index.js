import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LogInForm extends Component {
  state = {isError: false, errorMsg: '', username: '', password: ''}

  onUserNameChange = event => {
    this.setState({username: event.target.value})
  }

  onPasswordChange = event => {
    this.setState({password: event.target.value})
  }

  validateUser = async event => {
    event.preventDefault()
    const {history} = this.props
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const validateCredentials = await fetch(url, options)
    const jsonResponse = await validateCredentials.json()
    if (validateCredentials.ok === true) {
      const jwtToken = jsonResponse.jwt_token
      Cookies.set('jwt_token', jwtToken, {expires: 10})
      history.replace('/')
    } else {
      this.setState({isError: true, errorMsg: jsonResponse.error_msg})
    }
  }

  render() {
    const {isError, errorMsg} = this.state
    if (Cookies.get('jwt_token') !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-total-bg">
        <div className="login-cont">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="login-logo"
          />
          <form className="form-cont" onSubmit={this.validateUser}>
            <div className="input-label-cont">
              <label htmlFor="username" className="input-label">
                USERNAME
              </label>
              <input
                id="username"
                type="text"
                className="inputs"
                placeholder="Username"
                onChange={this.onUserNameChange}
              />
            </div>
            <div className="input-label-cont">
              <label htmlFor="password" className="input-label">
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                className="inputs"
                placeholder="Password"
                onChange={this.onPasswordChange}
              />
            </div>
            <div>
              <button type="submit" className="submit-button">
                Login
              </button>
              {isError && <p className="error-msg">*{errorMsg}</p>}
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default LogInForm
