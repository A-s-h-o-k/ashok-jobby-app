import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaHome} from 'react-icons/fa'
import {FiLogOut} from 'react-icons/fi'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const Header = props => {
  const logoutThePage = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="nav-bar">
      <Link to="/" className="link">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="navbar-logo"
        />
      </Link>
      <ul className="header-ul">
        <Link to="/" className="link">
          <li className="nav-li-item">Home</li>
        </Link>
        <Link to="/jobs" className="link">
          <li className="nav-li-item">Jobs</li>
        </Link>
      </ul>
      <button type="button" className="nav-button" onClick={logoutThePage}>
        Logout
      </button>
      <ul className="small-nav-ul">
        <li className="mobile-li-item">
          <Link to="/" className="link">
            <FaHome className="home-icon" />
          </Link>
          <Link to="/jobs" className="link">
            <BsFillBriefcaseFill className="home-icon" />
          </Link>
          <FiLogOut className="home-icon" onClick={logoutThePage} />
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
