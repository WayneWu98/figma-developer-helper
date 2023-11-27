interface Styles {
  rotation: number,
  color: string,
}

interface SelectedNode {
  FIGMA_KEY?: string,
  name: string,
  root?: string,
  instance: string,
  width: number,
  height: number,
  styles: Partial<Styles>,
}

interface Window {
  selectMenu: {
    init: Function,
    destroy: Function,
  },
  disclosure: {
    init: Function,
    destroy: Function,
  }
}