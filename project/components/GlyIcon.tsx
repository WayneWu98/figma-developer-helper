import * as React from 'react'
import GlyIconStyle from './GlyIcon.module.scss'
import classNames from 'classnames'

type Size = string | number | [string | number, string | number]

const noUnitRegx = /\d$/

const normalizeSize = (size: Size): React.CSSProperties => {
  const w = Array.isArray(size) ? size[0] : size
  let width = typeof w === 'number' ? `${w}px` : w
  if (noUnitRegx.test(width)) width += 'px'
  const h = Array.isArray(size) ? size[1] : size
  let height = typeof h === 'number' ? `${h}px` : h
  if (noUnitRegx.test(height)) height += 'px'
  return { width, height }
}

interface Props {
  name?: string
  icon: string
  size?: Size
  color?: string
  rotation?: number
  className?: string
  style?: React.CSSProperties
}

const DEFAULT_SIZE = '1em'
const HOST = import.meta.env.VITE_APP_ICON_HOST

const GlyIcon = (props: Props) => {
  const sizeStyle = normalizeSize(props.size ?? DEFAULT_SIZE)
  const rotationStyle = {
    '--rotation': `${props.rotation ?? 0}deg`,
  }
  const url = `${HOST}${props.icon}.svg`
  const iconStyle = {}
  if (props.color) {
    Object.assign(iconStyle, {
      '--mask': `url(${url})`,
      '--mask-color': props.color,
    } as React.CSSProperties)
  } else {
    Object.assign(iconStyle, {
      '--image': `url(${url})`,
    } as React.CSSProperties)
  }
  return (
    <div className={classNames(GlyIconStyle.wrap, props.className)} style={{ ...sizeStyle, ...rotationStyle }}>
      <div
        className={[GlyIconStyle.icon, props.color ? GlyIconStyle.mask : GlyIconStyle.image].join(' ')}
        style={iconStyle}
      ></div>
    </div>
  )
}

export default GlyIcon
