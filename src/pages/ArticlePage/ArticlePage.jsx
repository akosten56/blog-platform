import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { format } from 'date-fns'
import { nanoid } from 'nanoid'
import Markdown from 'react-markdown'
import { Spin, Popconfirm, Button } from 'antd'

import MyError from '../../components/App/MyError'
import { getArticleDataBySlug, deleteArticle, favoriteArticle, unfavoriteArticle } from '../../store/articlesSlice'
import favorite from '../../assets/favorite.svg'
import unfavorite from '../../assets/unfavorite.svg'

import cl from './ArticlePage.module.scss'

const ArticlePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { slug } = useParams()

  const { isLoggedIn } = useSelector((state) => state.userSlice)
  const { currentArticleData, errorNotification, isLoaded } = useSelector((state) => state.articlesSlice)
  const userData = useSelector((state) => state.userSlice.user)
  const { token, username: currentUser } = isLoggedIn ? userData : { token: '', username: '' }

  useEffect(() => {
    dispatch(getArticleDataBySlug(slug))
  }, [slug])

  const handleDeleteArticle = () => {
    dispatch(deleteArticle({ token, slug }))
    navigate('/')
  }

  const handleEditArticle = () => {
    navigate(`/articles/${slug}/edit`)
  }

  if (errorNotification) return <MyError />
  if (!isLoaded || !currentArticleData) return <Spin size="large" />

  const { title, tagList, description, body, createdAt, favorited, favoritesCount, author } = currentArticleData
  const { username, image } = author

  const tagsWithId = tagList.map((tag) => ({ id: nanoid(), value: tag }))
  const tags = tagsWithId.map(({ id, value }) => (
    <li key={id} className={cl.tagsItem}>
      {value}
    </li>
  ))

  const handleToggleFavorite = () => {
    if (!isLoggedIn) return navigate('/sign-in')
    favorited ? dispatch(unfavoriteArticle({ token, slug })) : dispatch(favoriteArticle({ token, slug }))
  }

  return (
    <div className={cl.article}>
      <div className={cl.info}>
        <div className={cl.content}>
          <div className={cl.container}>
            <h3 className={cl.title}>{title}</h3>
            <button className={cl.likes} onClick={handleToggleFavorite}>
              <img src={favorited ? favorite : unfavorite} alt="" />
              {favoritesCount}
            </button>
          </div>
          <ul className={cl.tags}>{tags}</ul>
        </div>
        <div className={cl.author}>
          <div className={cl.authorInfo}>
            <h3 className={cl.name}>{username}</h3>
            <span className={cl.date}>{format(new Date(createdAt), 'MMMM d, y')}</span>
          </div>
          <img className={cl.authorPhoto} src={image} alt="" />
        </div>
      </div>
      <div className={cl.description}>
        {description}
        {currentUser === username ? (
          <div className={cl.actions}>
            <Popconfirm
              description="Are you sure to delete this article?"
              onConfirm={handleDeleteArticle}
              okText="Yes"
              cancelText="No"
              placement="rightTop"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
            <Button
              type="primary"
              ghost
              onClick={handleEditArticle}
              style={{ border: '1px solid #52C41A', color: '#52C41A' }}
            >
              Edit
            </Button>
          </div>
        ) : null}
      </div>
      <div className={cl.body}>{<Markdown>{body}</Markdown>}</div>
    </div>
  )
}

export default ArticlePage
