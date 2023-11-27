import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { userEdit } from '../../store/userSlice'

import cl from './UserEditPage.module.scss'

const UserEditPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.userSlice)
  const { username, email, image, token } = user

  const { register, handleSubmit, formState } = useForm({ defaultValues: { username, email, image } })
  const { errors } = formState

  const [avatarImage, setAvatarImage] = useState()
  const [isAvatarImageValid, setIsAvatarImageValid] = useState(true)

  const submit = (data) => {
    const { username, email, password, image } = data
    dispatch(userEdit({ token, username, email, password, image }))
    navigate('/')
  }

  return (
    <form className={cl.signUp} onSubmit={handleSubmit(submit)}>
      <h3 className={cl.title}>Edit Profile</h3>

      <div className={cl.form}>
        <label className={`${cl.username} ${errors.username ? cl.invalid : ''}`}>
          Username
          <input
            type="text"
            placeholder="Username"
            {...register('username', { required: true, minLength: 3, maxLength: 20, pattern: /^[a-z][a-z0-9]*$/ })}
          />
          <div className={cl.errorMessage}>The input is not valid Username</div>
        </label>

        <label className={`${cl.email} ${errors.email ? cl.invalid : ''}`}>
          Email address
          <input
            type="email"
            placeholder="Email address"
            {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
          />
          <div className={cl.errorMessage}>The input is not valid Email.</div>
        </label>

        <label className={`${cl.password} ${errors.password ? cl.invalid : ''}`}>
          New password
          <input
            type="password"
            placeholder="New password"
            {...register('password', { required: true, minLength: 6, maxLength: 40 })}
          />
          <div className={cl.errorMessage}>Your password needs to be at least 6 characters.</div>
        </label>

        <label
          className={`${cl.avatar} ${errors.image || !isAvatarImageValid ? cl.invalid : ''}`}
          onChange={(e) => setAvatarImage(e.target.value)}
        >
          Avatar image (url)
          <img
            className={cl.avatarImage}
            src={avatarImage}
            alt=""
            onError={() => setIsAvatarImageValid(false)}
            onLoad={() => setIsAvatarImageValid(true)}
          />
          <input type="text" placeholder="Avatar image" {...register('image', { required: true })} />
          <div className={cl.errorMessage}>The input is not valid Avatar image.</div>
        </label>
      </div>

      <div className={cl.action}>
        <button className={cl.submitButton} type="submit">
          Create
        </button>
      </div>
    </form>
  )
}

export default UserEditPage
