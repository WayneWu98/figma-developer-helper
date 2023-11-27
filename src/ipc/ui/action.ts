import * as MainEvent from '../main/event'

export const ActionType = MainEvent.EventType
export type ActionMap = MainEvent.EventMap
export type ActionMapKey = MainEvent.EventMapKey
export type ActionMapValue = MainEvent.EventMapValue
export type ActionPayload<T extends ActionMapKey> = MainEvent.EventPayload<T>
export type ActionHandler<T extends ActionMapKey> = (payload: ActionPayload<T>) => void