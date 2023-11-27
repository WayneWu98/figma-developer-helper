import { EventHandler, EventMapKey, EventMapValue, EventType } from './event'
import { ActionMapKey, ActionPayload } from './action'
export * from './event'
export * from './action'

const listeners: { [K in EventMapKey]?: Set<EventHandler<K>> } = {}

export const on = <T extends EventMapKey>(type: T, callback: EventHandler<T>) => {
  if (!Reflect.has(listeners, type)) {
    // @ts-ignore
    listeners[type] = new Set()
  }
  listeners[type]!.add(callback)
  return () => off(type, callback)
}

export const off = <T extends EventMapKey>(type: T, callback: EventHandler<T>) => listeners[type]?.delete(callback)

const isFigmaEvent = (event: any): event is EventMapValue => {
  return typeof event === 'object' && Reflect.has(event, 'type') && Reflect.has(event, 'payload')
}

figma.ui.on('message', (event: EventMapValue) => {
  if (isFigmaEvent(event)) {
    if (Reflect.has(listeners, event.type)) {
      const callbacks = listeners[event.type]!
      for (const callback of callbacks) {
        callback(event.payload)
      }
    }
  }
})

export const postMessage = <T extends ActionMapKey>(type: T, payload: ActionPayload<T>) => {
  figma.ui.postMessage({ type, payload })
}

// Register base events listener
on(EventType.Notify, ({ message, options}) => figma.notify(message, options))