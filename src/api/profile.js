import axiosInstance from './axiosInstance'

const MOCK_ENABLED = true

const mockGetProfile = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          name: 'Abdalrhman Alkraien',
          email: 'abdalrhman@migfora.com',
          package: null,
          avatarColor: '#FF9900',
        },
      })
    }, 800)
  })
}

const mockUpdateProfile = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: { ...data, message: 'Profile updated successfully' } })
    }, 800)
  })
}

export const getProfileApi = () => {
  if (MOCK_ENABLED) return mockGetProfile()
  return axiosInstance.get('/profile/me')
}

export const updateProfileApi = (data) => {
  if (MOCK_ENABLED) return mockUpdateProfile(data)
  return axiosInstance.put('/profile/me', data)
}