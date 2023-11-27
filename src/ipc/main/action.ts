import * as UIEvent from '../ui/event'

export const ActionType = UIEvent.EventType
export type ActionMap = UIEvent.EventMap
export type ActionMapKey = UIEvent.EventMapKey
export type ActionMapValue = UIEvent.EventMapValue
export type ActionPayload<T extends ActionMapKey> = UIEvent.EventPayload<T>
export type ActionHandler<T extends ActionMapKey> = (payload: ActionPayload<T>) => void