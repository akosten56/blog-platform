import { Pagination, Spin } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { nanoid } from 'nanoid'

import MyError from '../App/MyError'
import ArticleListItem from '../ArticleListItem'
import { switchArticlesPage } from '../../store/articlesSlice'

import cl from './ArticleList.module.scss'

const ArticleList = () => {
  const dispatch = useDispatch()

  const { articlesData, articlesCurrentPage, articlesPageQty, isLoaded, error } = useSelector(
    (state) => state.articlesSlice
  )

  const handleSwitchPage = (page) => dispatch(switchArticlesPage(page))

  const articlesWithId = articlesData.map((props) => ({ id: nanoid(), ...props }))
  const articles = articlesWithId.map(({ id, ...props }) => (
    <li key={id} className={cl.listItem}>
      <ArticleListItem {...props} />
    </li>
  ))

  if (error) return <MyError />
  if (!isLoaded) return <Spin size="large" />

  return (
    <>
      <ul className={cl.list}>{articles}</ul>
      <Pagination
        defaultCurrent={articlesCurrentPage}
        total={articlesPageQty}
        showSizeChanger={false}
        onChange={handleSwitchPage}
        style={{ marginBottom: 24, textAlign: 'center' }}
      />
    </>
  )
}

export default ArticleList
