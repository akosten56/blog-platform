import { format } from 'date-fns'
import { Link, useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { useDispatch, useSelector } from 'react-redux'

import { favoriteArticle, unfavoriteArticle } from '../../store/articlesSlice'

import cl from './ArticleListItem.module.scss'
import favorite from './favorite.svg'
import unfavorite from './unfavorite.svg'

const ArticleListItem = ({ slug, title, tagList, description, createdAt, favoritesCount, author, favorited }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { username, image } = author
  const { isLoggedIn, user } = useSelector((state) => state.userSlice)
  const { token } = isLoggedIn ? user : { token: '' }

  const handleToggleFavorite = () => {
    if (!isLoggedIn) return navigate('/sign-in')
    favorited ? dispatch(unfavoriteArticle({ token, slug })) : dispatch(favoriteArticle({ token, slug }))
  }

  const tagsWithId = tagList.map((tag) => ({ id: nanoid(), value: tag }))
  const tags = tagsWithId.map(({ id, value }) => (
    <li key={id} className={cl.tagsItem}>
      {value}
    </li>
  ))

  return (
    <>
      <div className={cl.info}>
        <div className={cl.content}>
          <div className={cl.container}>
            <Link className={cl.title} to={`/articles/${slug}`}>
              {title}
            </Link>
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
      <div className={cl.text}>{description}</div>
    </>
  )
}

export default ArticleListItem
