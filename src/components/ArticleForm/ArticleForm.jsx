import React from 'react'

import cl from './ArticleForm.module.scss'

function ArticleForm({ mode, register, errors, handleSubmit, submit, tagList }) {
  return (
    <form className={cl.article} onSubmit={handleSubmit(submit)}>
      <h3 className={cl.articleTitle}>{mode === 'edit' ? 'Edit article' : 'Create new article'}</h3>

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
        {tagList}
      </div>

      <button className={cl.submitButton} type="submit">
        Send
      </button>
    </form>
  )
}

export default ArticleForm
