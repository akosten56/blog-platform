import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import BlogService from '../services/blog-service'

const blogService = new BlogService()

export const getArticlesData = createAsyncThunk(
  'articlesSlice/getArticlesData',
  async (offset, { rejectWithValue }) => {
    try {
      return await blogService.getArticlesData(offset)
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

export const getArticleDataBySlug = createAsyncThunk(
  'articlesSlice/getArticleDataBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      return await blogService.getArticleDataBySlug(slug)
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

export const createArticle = createAsyncThunk('articlesSlice/createArticle', async (data, { rejectWithValue }) => {
  try {
    return await blogService.createArticle(data)
  } catch (error) {
    rejectWithValue(error)
  }
})

export const deleteArticle = createAsyncThunk('articlesSlice/deleteArticle', async (data, { rejectWithValue }) => {
  try {
    return await blogService.deleteArticle(data)
  } catch (error) {
    rejectWithValue(error)
  }
})

export const editArticle = createAsyncThunk('articlesSlice/editArticle', async (data, { rejectWithValue }) => {
  try {
    return await blogService.editArticle(data)
  } catch (error) {
    rejectWithValue(error)
  }
})

export const favoriteArticle = createAsyncThunk('articlesSlice/favoriteArticle', async (data, { rejectWithValue }) => {
  try {
    return await blogService.favoriteArticle(data)
  } catch (error) {
    rejectWithValue(error)
  }
})

export const unfavoriteArticle = createAsyncThunk(
  'articlesSlice/favoriteArticle',
  async (data, { rejectWithValue }) => {
    try {
      return await blogService.unfavoriteArticle(data)
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

const pendingFunction = (state) => {
  state.infoNotification = null
  state.successNotification = null
  state.errorNotification = null
  state.isLoaded = false
}

const rejectedFunction = (state, action) => {
  state.errorNotification = action.payload
  state.isLoaded = true
}

const articlesSlice = createSlice({
  name: 'articlesSlice',
  initialState: {
    currentArticleData: null,
    articlesData: [],
    articlesOffset: 0,
    articlesPageQty: 0,
    articlesCurrentPage: 1,
    isLoaded: false,
    successNotification: null,
    errorNotification: null,
    infoNotification: null,
  },

  reducers: {
    switchArticlesPage: (state, action) => {
      state.articlesCurrentPage = action.payload
      state.articlesOffset = action.payload * 20 - 20
    },
    clearArticleNotification: (state) => {
      state.infoNotification = null
      state.successNotification = null
      state.errorNotification = null
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getArticlesData.pending, pendingFunction)
    builder.addCase(getArticlesData.fulfilled, (state, action) => {
      const { articles, articlesCount } = action.payload
      state.articlesData = articles
      state.articlesPageQty = Math.ceil(articlesCount / 20)
      state.isLoaded = true
    })
    builder.addCase(getArticlesData.rejected, rejectedFunction)

    builder.addCase(getArticleDataBySlug.pending, pendingFunction)
    builder.addCase(getArticleDataBySlug.fulfilled, (state, action) => {
      state.currentArticleData = action.payload
      state.isLoaded = true
    })
    builder.addCase(getArticleDataBySlug.rejected, rejectedFunction)

    builder.addCase(createArticle.pending, pendingFunction)
    builder.addCase(createArticle.fulfilled, (state, action) => {
      state.articlesData.unshift(action.payload)
      state.successNotification = 'Article was successfully created!'
      state.isLoaded = true
    })
    builder.addCase(createArticle.rejected, rejectedFunction)

    builder.addCase(deleteArticle.pending, pendingFunction)
    builder.addCase(deleteArticle.fulfilled, (state) => {
      const i = state.articlesData.findIndex((el) => el.slug === state.currentArticleData.slug)
      state.articlesData.splice(i, 1)
      state.infoNotification = 'Article was deleted'
      state.isLoaded = true
    })
    builder.addCase(deleteArticle.rejected, rejectedFunction)

    builder.addCase(editArticle.pending, pendingFunction)
    builder.addCase(editArticle.fulfilled, (state, action) => {
      const i = state.articlesData.findIndex((el) => el.slug === action.payload.slug)
      state.articlesData.splice(i, 1, action.payload)
      state.infoNotification = 'Article was edited'
      state.isLoaded = true
    })
    builder.addCase(editArticle.rejected, rejectedFunction)

    builder.addCase(favoriteArticle.fulfilled, (state, action) => {
      const i = state.articlesData.findIndex((el) => el.slug === action.payload.slug)
      state.articlesData.splice(i, 1, action.payload)
      state.currentArticleData = action.payload
    })
  },
})

export const { switchArticlesPage, clearArticleNotification } = articlesSlice.actions
export default articlesSlice.reducer
