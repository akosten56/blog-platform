import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'

import { userSignIn } from '../../store/userSlice'

import cl from './UserSignInPage.module.scss'

const UserSignInPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isLoggedIn, errorNotification } = useSelector((state) => state.userSlice)

  const { register, handleSubmit, formState } = useForm()
  const { errors } = formState

  useEffect(() => {
    if (isLoggedIn) navigate('/')
  }, [isLoggedIn])

  const submit = ({ email, password }) => dispatch(userSignIn({ email, password }))

  return (
    <form className={cl.signIn} onSubmit={handleSubmit(submit)}>
      <h3 className={cl.title}>Sign In</h3>

      <div className={cl.form}>
        <label className={`${cl.email} ${errors.email || errorNotification ? cl.invalid : ''}`}>
          Email address
          <input
            type="email"
            placeholder="Email address"
            {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
          />
          <div className={cl.errorMessage}>
            {errorNotification ? errorNotification : 'The input is not valid Email'}
          </div>
        </label>
        <label className={`${cl.password} ${errors.password || errorNotification ? cl.invalid : ''}`}>
          Password
          <input type="password" placeholder="Password" {...register('password', { required: true })} />
          <div className={cl.errorMessage}>
            {errorNotification ? errorNotification : 'Your password needs to be at least 6 characters'}
          </div>
        </label>
      </div>

      <div className={cl.action}>
        <button className={cl.submitButton} type="submit">
          Login
        </button>
        <div className={cl.haveAccount}>
          Don’t have an account?{' '}
          <Link to="/sign-up" className={cl.link}>
            Sign Up.
          </Link>
        </div>
      </div>
    </form>
  )
}

export default UserSignInPage
