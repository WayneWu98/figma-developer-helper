export const prune = (s: string) => {
  return s
    .replace(/\n\r/g, '')
    .replace(/\s+/g, ' ')
}

const normalize = (rate: number, base: 16 | 10 = 16) => {
  let color = 255
  if (rate < 1) {
    color *= rate
  }
  return color.toString(base).replace(/\..*$/, '')
}

export const normalizeColor = ({ r, g, b }: { r: number, g: number, b: number }, opacity: number = 1 ) => {
  if (opacity === 1) {
    return `#${normalize(r, 16).padStart(2, '0')}${normalize(g, 16).padStart(2, '0')}${normalize(b, 16).padStart(2, '0')}`
  }
  return `rgba(${normalize(r, 10)}, ${normalize(g, 10)}, ${normalize(b, 10)}, ${opacity})`
}

export const generateVueCode = (attrs: Record<string, any>) => {
  const shim = Object
    .entries(attrs)
    .filter(([, v]) => v)
    .map(([k, v]) => {
      if (typeof v === 'string') {
        return `${k}="${v}"`
      }
      if (Array.isArray(v)) {
        return `:${k}="[${v.join(', ')}]"`
      }
      return `:${k}="${v}"`
    })
    .join(' ')
  return `<${import.meta.env.VITE_APP_COMPONENT_NAME} ${shim} />`
}
export const generateReactCode = (attrs: Record<string, any>) => {
  const shim = Object
    .entries(attrs)
    .filter(([, v]) => v)
    .map(([k, v]) => {
      if (typeof v === 'string') {
        return `${k}="${v}"`
      }
      if (Array.isArray(v)) {
        return `${k}={[${v.join(', ')}]}`
      }
      return `${k}={${v}}`
    })
    .join(' ')
  return `<${import.meta.env.VITE_APP_COMPONENT_NAME} ${shim} />`
}