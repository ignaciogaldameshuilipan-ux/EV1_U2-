export const API_URL = 'https://backend-react-fcsl.onrender.com/api-backend'

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.status = status
    this.data = data
  }
}

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  console.info(`[API] ${method} ${path} -> ${res.status}`)
  const data = res.status === 204 ? null : await res.json().catch(() => null)

  if (!res.ok) {
    throw new ApiError(data?.error || 'Error en la petición', res.status, data)
  }
  return data
}

export const register = (user) =>
  request('/auth/register', { method: 'POST', body: user })
export const login = (email, password) =>
  request('/auth/login', { method: 'POST', body: { email, password } })
export const getMe = (token) => request('/auth/me', { token })
export const getHealth = () => request('/health')

export const getPosts = () => request('/posts')
export const getPost = (id) => request(`/posts/${id}`)
export const createPost = (token, post) =>
  request('/posts', { method: 'POST', token, body: post })
export const getPostReactions = (postId) => request(`/posts/${postId}/reactions`)
export const reactToPost = (postId, type, userId) =>
  request(`/posts/${postId}/reactions`, {
    method: 'POST',
    body: userId ? { type, userId } : { type },
  })
export const deletePostReaction = (id) =>
  request(`/reactions/${id}`, { method: 'DELETE' })

export const getComments = (postId) => request(`/posts/${postId}/comments`)
export const createComment = (postId, content, userId) =>
  request(`/posts/${postId}/comments`, {
    method: 'POST',
    body: userId ? { content, userId } : { content },
  })
export const deleteComment = (id) =>
  request(`/comments/${id}`, { method: 'DELETE' })

export const getCommentReactions = (commentId) =>
  request(`/comments/${commentId}/reactions`)
export const reactToComment = (commentId, type, userId) =>
  request(`/comments/${commentId}/reactions`, {
    method: 'POST',
    body: userId ? { type, userId } : { type },
  })
export const deleteCommentReaction = (id) =>
  request(`/comment-reactions/${id}`, { method: 'DELETE' })

export const getUsers = () => request('/users')
export const getUser = (id) => request(`/users/${id}`)
