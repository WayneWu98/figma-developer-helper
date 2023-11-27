import Axios from 'axios'

const request = Axios.create({ baseURL: 'http://127.0.0.1:' + import.meta.env.VITE_APP_PORT })

request.interceptors.response.use(res => {
  if (res.status === 200) {
    return res.data
  }
  throw new Error(res.data.err)
})

export const isFileExisted = (digest: string) => request.get(`/${digest}`)

export const uploadFile = (file: string) => request.post('/upload', file, { headers: { "Content-Type": 'text/plain' } })

export const writeClipboard = (content: any) => request.post('/copy', content, { headers: { "Content-Type": 'text/plain' } })