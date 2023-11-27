import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import BlogService from '../services/blog-service'

const blogService = new BlogService()

export const userSignUp = createAsyncThunk('userSlice/userSignUp', async (data, { rejectWithValue, dispatch }) => {
  try {
    return await blogService.userSignUp(data)
  } catch (error) {
    dispatch(errorNotification(error.message))
    rejectWithValue(error)
  }
})

export const userSignIn = createAsyncThunk('userSlice/userSignIn', async (data, { rejectWithValue, dispatch }) => {
  try {
    return await blogService.userSignIn(data)
  } catch (error) {
    dispatch(errorNotification(`Email or password ${error.message}`))
    rejectWithValue(`Email or password ${error.message}`)
  }
})

export const userEdit = createAsyncThunk('userSlice/userEdit', async (data, { rejectWithValue, dispatch }) => {
  try {
    return await blogService.userEdit(data)
  } catch (error) {
    dispatch(errorNotification('Profile edited failed'))
    rejectWithValue('Profile edited failed')
  }
})

const pendingFunction = (state) => {
  state.successNotification = null
  state.errorNotification = null
  state.infoNotification = null
}

const rejectedFunction = (state, action) => {
  state.errorNotification = action.payload
}

const userSlice = createSlice({
  name: 'userSlice',

  initialState: {
    user: null,
    isLoggedIn: false,
    successNotification: null,
    errorNotification: null,
    infoNotification: null,
  },

  reducers: {
    errorNotification: (state, action) => {
      state.isLoggedIn = false
      state.errorNotification = action.payload
    },
    userLogOut: (state) => {
      state.user = null
      state.isLoggedIn = false
      state.successNotification = null
      state.errorNotification = null
      state.infoNotification = 'You are logged out'
    },
    clearUserNotification: (state) => {
      state.infoNotification = null
      state.successNotification = null
      state.errorNotification = null
    },
  },

  extraReducers: (builder) => {
    builder.addCase(userSignUp.pending, pendingFunction)
    builder.addCase(userSignUp.fulfilled, (state, action) => {
      if (state.errorNotification) return
      state.isLoggedIn = true
      state.successNotification = 'Sign Up was successful!'
      state.user = action.payload
    })
    builder.addCase(userSignUp.rejected, rejectedFunction)

    builder.addCase(userSignIn.pending, pendingFunction)
    builder.addCase(userSignIn.fulfilled, (state, action) => {
      if (state.errorNotification) return
      state.isLoggedIn = true
      state.infoNotification = 'You are sign in'
      state.user = action.payload
    })
    builder.addCase(userSignIn.rejected, rejectedFunction)

    builder.addCase(userEdit.pending, pendingFunction)
    builder.addCase(userEdit.fulfilled, (state, action) => {
      if (state.errorNotification) return
      state.successNotification = 'Profile edited successfully!'
      state.user = action.payload
    })
    builder.addCase(userEdit.rejected, rejectedFunction)
  },
})

export const { errorNotification, userLogOut, clearUserNotification } = userSlice.actions
export default userSlice.reducer
