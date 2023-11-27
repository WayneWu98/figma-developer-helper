export enum EventType {
  Notify = 'notify',
}

export interface Event<P = any> {
  type: EventMapKey,
  payload: P,
}

export interface NotifyEvent extends Event<{ message: string, options?: NotificationOptions }> {}

export interface EventMap {
  [EventType.Notify]: NotifyEvent,
}

export type EventMapKey = keyof EventMap
export type EventMapValue = EventMap[EventMapKey]

export type EventPayload<T extends EventMapKey> = EventMap[T]['payload']
export type EventHandler<T extends EventMapKey> = (payload: EventPayload<T>) => void