import axiosInstance from './axiosInstance'

// ─── MOCK — remove when real API is ready ───────────────────
const MOCK_ENABLED = true

const mockLogin = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.username === 'admin' && data.password === 'admin') {
        resolve({
          data: {
            token: 'mock-token-abc123',
            user: {
              id: 1,
              username: 'admin',
              name: 'Abdalrhman',
            },
            message: 'Login successful',
          }
        })
      } else {
        reject({
          response: {
            data: {
              message: 'Invalid username or password'
            }
          }
        })
      }
    }, 800) // simulate network delay
  })
}

const mockRegister = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.username === 'admin') {
        reject({
          response: { data: { message: 'Username already exists' } }
        })
      } else {
        resolve({
          data: { message: 'Registration successful' }
        })
      }
    }, 800)
  })
}
// ────────────────────────────────────────────────────────────

export const loginApi = (data) => {
  if (MOCK_ENABLED) return mockLogin(data)
  return axiosInstance.post('/auth/login', data)
}

export const registerApi = (data) => {
  if (MOCK_ENABLED) return mockRegister(data)
  return axiosInstance.post('/auth/register', data)
}

export const logoutApi = () => {
  return axiosInstance.post('/auth/logout')
}