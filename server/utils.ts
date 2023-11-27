import md5 from 'crypto-js/md5'

export const hash = (s: string) => md5(s).toString()