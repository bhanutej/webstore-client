import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth-context/auth';

import './NavBar.css';

export const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  let authUser = JSON.parse(localStorage.getItem("authUser"));
  if(!authUser) {
    authUser = auth.user;
  }
  const navLinkStyles = ({ isActive }) => {
    return {
      fontWeight: isActive ? 'bold' : 'normal',
      textDecoration: isActive ? 'none' : 'underline'
    }
  }

  const signOut = () => {
    auth.logout();
    navigate('/');
    navigate(0);
  }

  return (
    <nav className='primary-nav'>
      <div className="logoContainer">
        <NavLink to='/' style={navLinkStyles}>
          Home
        </NavLink>
      </div>
      <div className="navbarMenus">
        <NavLink to='/about' style={navLinkStyles}>
          About
        </NavLink>
        { (!authUser) && (
          <NavLink to='/login' style={navLinkStyles}>
            Login
          </NavLink>
        )}
        { authUser && (
          <NavLink onClick={signOut} style={navLinkStyles}>
            Logout
          </NavLink>
        )}
      </div>
    </nav>
  )
}