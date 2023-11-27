export enum EventType {
  Select = 'select',
}

export interface Event<P = any> {
  type: EventMapKey,
  payload: P,
}

export interface SelectEvent extends Event<SelectedNode> {}

export interface EventMap {
  [EventType.Select]: SelectEvent
}

export type EventMapKey = keyof EventMap
export type EventMapValue = EventMap[EventMapKey]

export type EventPayload<T extends EventMapKey> = EventMap[T]['payload']
export type EventHandler<T extends EventMapKey> = (payload: EventPayload<T>) => void

export const isEvent = <T extends EventMapKey>(e: EventMapValue, type: T): e is EventMap[T] => e.type === type

