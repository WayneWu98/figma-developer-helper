import { TextDecoder } from '@zxing/text-encoding'
import * as IpcMain from './ipc/main'
import { prune, normalizeColor } from './utils'

console.clear()

figma.showUI(__html__, { height: 500 });

figma.on('selectionchange', async () => {
  const toDeleted: InstanceNode[] = []
  try {
    const decoder = new TextDecoder('utf-8')
    const selected = figma.currentPage.selection?.[0]

    if (!selected) {
      return
    }

    const node: SelectedNode = { 
      name: selected.name,
      width: selected.width, 
      height: selected.height,
      styles: {
        rotation: 0
      },
      instance: prune(decoder.decode(await selected.exportAsync({ format: 'SVG' }))), 
    }

    // @ts-ignore
    selected.rotation && (node.styles.rotation = selected.rotation)

    if (selected.type === 'COMPONENT') {
      node.FIGMA_KEY = selected.key
      node.root = node.instance
      node.styles.rotation = 0
    } else if (Reflect.has(selected, 'children')) {
      // @ts-ignore
      for (const child of selected.children) {
        const fill = child?.fills?.[0] as Paint | undefined
        if (fill?.type === 'SOLID' && fill.visible) {
          node.styles.color = normalizeColor(fill.color, fill.opacity)
          break
        }
      }
    }

    if (selected.type === 'INSTANCE' && selected.mainComponent) {
      const root = selected.mainComponent
      const  instance = root.createInstance()
      // instance will append to page, delete it later
      toDeleted.push(instance)
      if (node.styles.rotation === instance.rotation) {
        node.styles.rotation = 0
      }
      node.FIGMA_KEY = root.key
      node.root = prune(decoder.decode(await instance.exportAsync({ format: 'SVG' })))
      if (Reflect.has(instance, 'children')) {
        // @ts-ignore
        for (const child of instance.children) {
          // @ts-ignore
          const fill = child?.fills?.[0] as Paint | undefined
          if (fill?.type === 'SOLID' && fill.visible) {
            const color = normalizeColor(fill.color, fill.opacity)
            if (color === node.styles.color) {
              Reflect.deleteProperty(node.styles, 'color')
            }
          }
        }
      }
    }
    node.styles.rotation = -node.styles.rotation!
    IpcMain.postMessage(IpcMain.ActionType.Select, node)
  } catch (err) {
    console.error('[Figma Developer Helper] Ops:', err)
  }
  for (const node of toDeleted) {
    node.remove()
  }
})
