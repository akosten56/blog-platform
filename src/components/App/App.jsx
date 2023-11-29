import { Routes, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, lazy, Suspense } from 'react'
import { Spin } from 'antd'

import Layout from '../Layout'
import ArticleList from '../ArticleList'
import ArticlePage from '../../pages/ArticlePage'
const ArticleCreatePage = lazy(() => import('../../pages/ArticleCreatePage'))
const ArticleEditPage = lazy(() => import('../../pages/ArticleEditPage'))
import UserSignUpPage from '../../pages/UserSignUpPage'
import UserSignInPage from '../../pages/UserSignInPage'
const UserEditPage = lazy(() => import('../../pages/UserEditPage'))
import RequireAuth from '../../hoc/RequireAuth'
import { getArticlesData } from '../../store/articlesSlice'

import './App.scss'

const App = () => {
  const dispatch = useDispatch()
  const { articlesOffset } = useSelector((state) => state.articlesSlice)

  useEffect(() => {
    dispatch(getArticlesData(articlesOffset))
  }, [articlesOffset])

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ArticleList />} />
        <Route path="articles" element={import('../ArticleList')} />
        <Route path="articles/:slug" element={<ArticlePage />} />
        <Route path="sign-up" element={<UserSignUpPage />} />
        <Route path="sign-in" element={<UserSignInPage />} />
        <Route
          path="profile"
          element={
            <RequireAuth>
              <Suspense fallback={<Spin size="large" />}>
                <UserEditPage />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route
          path="new-article"
          element={
            <RequireAuth>
              <Suspense fallback={<Spin size="large" />}>
                <ArticleCreatePage />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route
          path="articles/:slug/edit"
          element={
            <RequireAuth>
              <Suspense fallback={<Spin size="large" />}>
                <ArticleEditPage />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route path="*" element={<Layout />} />
      </Route>
    </Routes>
  )
}

export default App
