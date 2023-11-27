import { Link, useNavigate } from 'react-router-dom'
import { Checkbox } from 'antd'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { userSignUp } from '../../store/userSlice'

import cl from './UserSignUpPage.module.scss'

const UserSignUpPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isLoggedIn, errorNotification } = useSelector((state) => state.userSlice)

  const { register, handleSubmit, formState } = useForm()
  const { errors } = formState

  useEffect(() => {
    if (isLoggedIn) navigate('/')
  }, [isLoggedIn])

  const [passwordValue, setPasswordValue] = useState('')
  const [repeatPasswordValue, setRepeatPasswordValue] = useState('')
  const [isPasswordsMatch, setIsPasswordsMatch] = useState(true)
  const [agreeProcessing, setAgreeProcessing] = useState(false)

  let serverErrorUsername, serverErrorEmail
  if (errorNotification && errorNotification === 'U') {
    serverErrorUsername = true
  }
  if (errorNotification && errorNotification === 'E') {
    serverErrorEmail = true
  }
  if (errorNotification && errorNotification === 'UE') {
    serverErrorEmail = true
    serverErrorUsername = true
  }

  const handlePasswordChange = (e) => {
    setPasswordValue(e.target.value)
    setIsPasswordsMatch(e.target.value === repeatPasswordValue)
  }

  const handleRepeatPasswordChange = (e) => {
    setRepeatPasswordValue(e.target.value)
    setIsPasswordsMatch(e.target.value === passwordValue)
  }

  const submit = ({ username, email, password }) => {
    dispatch(userSignUp({ username, email, password }))
  }

  return (
    <form className={cl.signUp} onSubmit={handleSubmit(submit)}>
      <h3 className={cl.title}>Create new account</h3>

      <div className={cl.form}>
        <label className={`${cl.username} ${errors.username || serverErrorUsername ? cl.invalid : ''}`}>
          Username
          <input
            type="text"
            placeholder="Username"
            {...register('username', { required: true, minLength: 3, maxLength: 20, pattern: /^[a-z][a-z0-9]*$/ })}
          />
          <div className={cl.errorMessage}>
            {serverErrorUsername ? 'Username is already taken' : 'The input is not valid Username'}
          </div>
        </label>

        <label className={`${cl.email} ${errors.email || serverErrorEmail ? cl.invalid : ''}`}>
          Email address
          <input
            type="email"
            placeholder="Email address"
            {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
          />
          <div className={cl.errorMessage}>
            {serverErrorEmail ? 'Email is already taken' : 'The input is not valid Email'}
          </div>
        </label>

        <label className={`${cl.password} ${errors.password ? cl.invalid : ''}`} onChange={handlePasswordChange}>
          Password
          <input
            type="password"
            placeholder="Password"
            {...register('password', { required: true, minLength: 6, maxLength: 40 })}
          />
          <div className={cl.errorMessage}>Your password needs to be at least 6 characters</div>
        </label>

        <label
          className={`${cl.password} ${!isPasswordsMatch ? cl.invalid : ''}`}
          onChange={handleRepeatPasswordChange}
        >
          Repeat Password
          <input
            type="password"
            placeholder="Repeat Password"
            {...register('repeatPassword', { required: true, validate: () => passwordValue === repeatPasswordValue })}
          />
          <div className={cl.errorMessage}>Passwords must match</div>
        </label>
      </div>

      <div className={cl.privacyPolicy}>
        <Checkbox onChange={() => setAgreeProcessing((value) => !value)} checked={agreeProcessing}>
          I agree to the processing of my personal information
        </Checkbox>
      </div>

      <div className={cl.action}>
        <button className={cl.submitButton} type="submit" disabled={!agreeProcessing}>
          Create
        </button>
        <div className={cl.haveAccount}>
          Already have an account?{' '}
          <Link to="/sign-in" href="" className={cl.link}>
            Sign In.
          </Link>
        </div>
      </div>
    </form>
  )
}

export default UserSignUpPage
