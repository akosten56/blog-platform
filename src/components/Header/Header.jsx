import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { userLogOut } from '../../store/userSlice'

import cl from './Header.module.scss'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, isLoggedIn } = useSelector((state) => state.userSlice)

  const handleLogOut = () => {
    dispatch(userLogOut())
    navigate('/')
  }

  if (isLoggedIn) {
    const { username, image } = user
    return (
      <header className={cl.header}>
        <Link className={cl.title} to="/">
          Realworld Blog
        </Link>
        <div className={cl.access}>
          <Link className={cl.createArticle} to="/new-article">
            Create article
          </Link>
          <Link className={cl.author} to="/profile">
            <h3 className={cl.name}>{username}</h3>
            <img className={cl.avatar} src={image} alt="" />
          </Link>
          <button className={cl.logOut} onClick={handleLogOut}>
            Log Out
          </button>
        </div>
      </header>
    )
  }

  return (
    <header className={cl.header}>
      <Link className={cl.title} to="/">
        Realworld Blog
      </Link>
      <div className={cl.access}>
        <Link className={cl.signIn} to="/sign-in">
          Sign In
        </Link>
        <Link className={cl.signUp} to="/sign-up">
          Sign Up
        </Link>
      </div>
    </header>
  )
}

export default Header
