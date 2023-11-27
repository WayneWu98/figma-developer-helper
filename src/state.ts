import { reactive } from 'vue'
import * as IpcUI from './ipc/ui'
import { EventType } from './ipc/ui/event'

interface State {
  selected?: SelectedNode
}

const state = reactive<State>({
  selected: undefined
})

IpcUI.on(EventType.Select, node => state.selected = node)


export default state