import { EventHandler, EventMapKey, EventMapValue } from './event'
import { ActionType, ActionMapKey, ActionPayload } from './action'
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

const isFigmaEventMessage = (e: MessageEvent): e is MessageEvent<{ pluginMessage: EventMapValue }> => {
  return !!e.data?.pluginMessage?.payload && !!e.data?.pluginMessage?.type
}

window.addEventListener('message', e => {
  if (isFigmaEventMessage(e)) {
    const event = e.data.pluginMessage
    if (Reflect.has(listeners, event.type)) {
      const callbacks = listeners[event.type]!
      for (const callback of callbacks) {
        callback(event.payload)
      }
    }
  }
})

export const postMessage = <T extends ActionMapKey>(type: T, payload: ActionPayload<T>) => {
  parent.postMessage({
    pluginMessage: {
      type,
      payload,
    }
  }, '*')
}

export const notify = (message: string, options?: NotificationOptions) => postMessage(ActionType.Notify, { message, options })