import { slide as Menu } from 'react-burger-menu'
import { Link } from 'react-router-dom';
import Auth from '../../utils/auth';

const Nav = () => {
const logout = event => {
    event.preventDefault();
    Auth.logout();
  };
  return (
<Menu>
          {Auth.loggedIn() ? (
            <>
              <Link to="/profile" className="menu-item text-light">Me</Link>
              <br></br>
              <br></br>
              <a href="/" onClick={logout} className="menu-item text-light">
                Logout
              </a>
            </>
          ) : (
            <>
              <Link to="/login" className="menu-item text-light">Login</Link>
              <br></br>
              <br></br>
              <Link to="/signup" className="menu-item text-light">Signup</Link>
            </>
          )}
        </Menu>

);
};

export default Nav;