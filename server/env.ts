import dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env'), override: true })
dotenv.config({ path: resolve(__dirname, '../.env.local'), override: true })

export const PORT = +process.env.VITE_APP_PORT!
export const OSS_REGION = process.env.OSS_REGION!
export const OSS_ACCESS_KEY_ID = process.env.OSS_ACCESS_KEY_ID!
export const OSS_ACCESS_KEY_SECRET = process.env.OSS_ACCESS_KEY_SECRET!
export const OSS_BUCKET = process.env.OSS_BUCKET!
export const CDN_HOST = process.env.VITE_APP_CDN_HOST!
export const UPLOAD_DIR_PREFIX = CDN_HOST.replace(/^https?:\/\/.*?\//, '')