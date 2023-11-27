import OSS from 'ali-oss'
import { OSS_REGION, OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET, OSS_BUCKET, UPLOAD_DIR_PREFIX } from './env'

export const client = new OSS({
  region: OSS_REGION,
  accessKeyId: OSS_ACCESS_KEY_ID,
  accessKeySecret: OSS_ACCESS_KEY_SECRET,
  bucket: OSS_BUCKET,
})

export const isFileExisted = (name: string) => client.head(UPLOAD_DIR_PREFIX + name)

export const uploadFile = (name: string, buffer: Buffer) => client.put(UPLOAD_DIR_PREFIX + name, buffer)