import { Outlet } from 'react-router-dom'
import { notification } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import Header from '../Header'
import { clearArticleNotification } from '../../store/articlesSlice'
import { clearUserNotification } from '../../store/userSlice'

import cl from './Layout.module.scss'

const Layout = () => {
  const dispatch = useDispatch()
  const { successNotification: userSuccess, infoNotification: userInfo } = useSelector((state) => state.userSlice)
  const { successNotification: articleSuccess, infoNotification: articleInfo } = useSelector(
    (state) => state.articlesSlice
  )

  const [api, contextHolder] = notification.useNotification()

  useEffect(() => {
    if (userSuccess) api.success({ message: userSuccess, placement: 'bottomRight' })
    if (userInfo) api.info({ message: userInfo, placement: 'bottomRight' })
    if (articleSuccess) api.success({ message: articleSuccess, placement: 'bottomRight' })
    if (articleInfo) api.info({ message: articleInfo, placement: 'bottomRight' })
    dispatch(clearArticleNotification())
    dispatch(clearUserNotification())
  }, [userSuccess, userInfo, articleSuccess, articleInfo])

  return (
    <>
      {contextHolder}
      <div className={cl.wrapper}>
        <Header />
        <main className={cl.main}>
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default Layout
