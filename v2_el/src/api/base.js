import axios from 'axios'

axios.interceptors.request.use(function (config) {
  const backendToken = sessionStorage.getItem('backendToken')
  if (backendToken) {
    config.headers.backendToken = `${backendToken}`
  }
  return config
}, function (error) {
  console.log('error', error)
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
},
error => {
  if (error.response && error.response.status === 401) {
    sessionStorage.removeItem('backendToken')

    window.location.href = '/'
  } else {
    return Promise.reject(error)
  }
})
