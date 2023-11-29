import { Button, Spin } from 'antd'
import { useForm } from 'react-hook-form'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { editArticle, getArticleDataBySlug } from '../../store/articlesSlice'
import MyError from '../../components/App/MyError'
import ArticleForm from '../../components/ArticleForm'
import cl from '../../components/ArticleForm/ArticleForm.module.scss'

const ArticleEditPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { slug } = useParams()

  useEffect(() => {
    dispatch(getArticleDataBySlug(slug))
  }, [slug])

  const { token } = useSelector((state) => state.userSlice.user)
  const { currentArticleData, errorNotification, isLoaded } = useSelector((state) => state.articlesSlice)
  const defaultArticleData = { title: '', tagList: [''], description: '', body: '' }
  const { title, tagList, description, body } = currentArticleData ? currentArticleData : defaultArticleData

  const [tags, setTags] = useState(tagList.map((tag) => [nanoid(), tag]))
  const defaultTags = Object.fromEntries(tags)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    resetField,
  } = useForm({
    defaultValues: { title, description, body, ...defaultTags },
  })

  const handleAddTag = () => setTags((state) => [...state, [nanoid(), '']])

  const handleDeleteTag = (id) => {
    resetField(id, { defaultValue: null })
    setTags((state) => {
      const newState = [...state]
      const i = newState.findIndex((el) => el[0] === id)
      newState.splice(i, 1)
      return newState
    })
  }

  const submit = (data) => {
    const { title, description, body, ...tagsObj } = data
    const duplicates = Object.entries(tagsObj).filter((el, i, arr) => i !== arr.findIndex((e) => e[1] === el[1]))
    duplicates.forEach((el) => setError(el[0], { type: 'custom' }))
    if (duplicates.length) return
    const tagList = Object.values(tagsObj).filter((el) => el)

    dispatch(editArticle({ token, slug, title, description, body, tagList }))
    navigate('/')
  }

  if (errorNotification) return <MyError />
  if (!isLoaded || !currentArticleData) return <Spin size="large" />

  const elements = tags.map((tag, i, arr) => {
    const id = tag[0]
    return (
      <label key={id} className={`${cl.tag} ${errors[id] ? cl.invalid : ''}`}>
        <div className={cl.tagInput}>
          <input
            type="text"
            placeholder="Tag"
            {...register(id, { required: true, maxLength: 40, pattern: /^[a-zA-Z0-9]+$/ })}
          />
          <div className={cl.errorMessage}>The input is not valid Tag</div>
        </div>
        {arr.length === 1 ? (
          <Button type="primary" disabled danger ghost onClick={() => handleDeleteTag(id)}>
            Delete
          </Button>
        ) : (
          <Button type="primary" danger ghost onClick={() => handleDeleteTag(id)}>
            Delete
          </Button>
        )}
        {i === arr.length - 1 ? (
          <Button type="primary" ghost onClick={handleAddTag}>
            Add tag
          </Button>
        ) : null}
      </label>
    )
  })

  return <ArticleForm {...{ mode: 'edit', register, errors, handleSubmit, submit, tagList: elements }} />
}

export default ArticleEditPage
