import { Button, Spin } from 'antd'
import { useForm } from 'react-hook-form'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { createArticle, editArticle, getArticleDataBySlug } from '../../store/articlesSlice'
import MyError from '../../components/App/MyError'

import cl from './ArticleActionsPage.module.scss'

const ArticleActionsPage = ({ edit }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { slug } = useParams()

  useEffect(() => {
    dispatch(getArticleDataBySlug(slug))
  }, [slug])

  const { token } = useSelector((state) => state.userSlice.user)
  const { currentArticleData, errorNotification, isLoaded } = useSelector((state) => state.articlesSlice)
  const defaultArticleData = { title: '', tagList: [''], description: '', body: '' }
  const { title, tagList, description, body } = edit && currentArticleData ? currentArticleData : defaultArticleData

  const [tags, setTags] = useState(tagList.map((tag) => [nanoid(), tag]))

  const defaultTags = Object.fromEntries(tags)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    resetField,
  } = useForm({
    defaultValues: edit ? { title, description, body, ...defaultTags } : {},
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
    dispatch(
      edit
        ? editArticle({ token, slug, title, description, body, tagList })
        : createArticle({ token, title, description, body, tagList })
    )
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

  return (
    <form className={cl.article} onSubmit={handleSubmit(submit)}>
      <h3 className={cl.articleTitle}>{edit ? 'Edit article' : 'Create new article'}</h3>
      <label className={`${cl.title} ${errors.title ? cl.invalid : ''}`}>
        Title
        <input type="text" placeholder="Title" {...register('title', { required: true, maxLength: 80 })} />
        <div className={cl.errorMessage}>The input is not valid Title</div>
      </label>
      <label className={`${cl.description} ${errors.description ? cl.invalid : ''}`}>
        Short description
        <input
          type="text"
          placeholder="Short description"
          {...register('description', { required: true, maxLength: 120 })}
        />
        <div className={cl.errorMessage}>The input is not valid Description</div>
      </label>
      <label className={`${cl.body} ${errors.body ? cl.invalid : ''}`}>
        Text
        <textarea placeholder="Text" {...register('body', { required: true })} />
        <div className={cl.errorMessage}>The input is not valid Text</div>
      </label>

      <div className={`${cl.tags} ${errors.tags ? cl.invalid : ''}`}>
        Tags
        {elements}
      </div>

      <button className={cl.submitButton} type="submit">
        Send
      </button>
    </form>
  )
}

export default ArticleActionsPage
