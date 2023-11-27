export default class BlogService {
  constructor() {
    this.apiBase = 'https://blog.kata.academy/api/'
  }

  async userEdit({ token, username, email, password, image }) {
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
      body: JSON.stringify({ user: { username, email, password, image, bio: '' } }),
    }

    const response = await fetch(`${this.apiBase}/user`, options)
    if (!response.ok) throw new Error(`${response.status}`)
    const data = await response.json()
    return data.user
  }

  async userSignIn({ email, password }) {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { email, password } }),
    }

    const response = await fetch(`${this.apiBase}/users/login`, options)
    const data = await response.json()
    if (!response.ok) throw new Error(`${data.errors['email or password']}`)
    return data.user
  }

  async userSignUp({ username, email, password }) {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { username, email, password } }),
    }

    const response = await fetch(`${this.apiBase}/users`, options)
    const data = await response.json()
    if (!response.ok) {
      let errorMessage
      if (data.errors.username) errorMessage = 'U'
      if (data.errors.email) errorMessage = 'E'
      if (data.errors.username && data.errors.email) errorMessage = 'UE'
      throw new Error(`${errorMessage}`)
    }
    return data.user
  }

  async getArticlesData(offset) {
    const response = await fetch(`${this.apiBase}/articles?offset=${offset}`)
    const data = await response.json()
    if (!response.ok) throw new Error(`${data.errors.body}`)
    return data
  }

  async getArticleDataBySlug(slug) {
    const response = await fetch(`${this.apiBase}articles/${slug}`)
    const data = await response.json()
    if (!response.ok) throw new Error(`${data.errors.body}`)
    return data.article
  }

  async createArticle({ token, title, description, body, tagList }) {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
      body: JSON.stringify({ article: { title, description, body, tagList } }),
    }

    const response = await fetch(`${this.apiBase}/articles`, options)
    const data = await response.json()
    if (!response.ok) throw new Error(`${data.errors.body}`)
    return data.article
  }

  async deleteArticle({ token, slug }) {
    const options = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
    }

    const response = await fetch(`${this.apiBase}/articles/${slug}`, options)
    const data = await response.json()
    if (!response.ok) throw new Error(`${data.errors.body}`)
    return data.article
  }

  async editArticle({ token, slug, title, description, body, tagList }) {
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
      body: JSON.stringify({ article: { title, description, body, tagList } }),
    }

    const response = await fetch(`${this.apiBase}/articles/${slug}`, options)
    const data = await response.json()
    if (!response.ok) throw new Error(`${data.errors.body}`)
    return data.article
  }

  async favoriteArticle({ token, slug }) {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
    }

    const response = await fetch(`${this.apiBase}/articles/${slug}/favorite`, options)
    const data = await response.json()
    if (!response.ok) throw new Error(`${data.errors.body}`)
    return data.article
  }

  async unfavoriteArticle({ token, slug }) {
    const options = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
    }

    const response = await fetch(`${this.apiBase}/articles/${slug}/favorite`, options)
    const data = await response.json()
    if (!response.ok) throw new Error(`${data.errors.body}`)
    return data.article
  }
}
