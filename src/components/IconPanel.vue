<script setup lang="ts">
import * as IpcUI from '../ipc/ui';
import { computed, getCurrentInstance, ref, watch } from 'vue'
import { generateReactCode, generateVueCode } from '..//utils'
import { isFileExisted, uploadFile, writeClipboard } from '../api/index'

const props = withDefaults(defineProps<{ defaultExpanded?: boolean, title: string, svg?: string, restyle?: boolean, attrs: Record<string, any> }>(), { defaultExpanded: true })
// const disabled = computed(() => props)
const expanded = ref(props.defaultExpanded)

const src = computed(() => {
  if (props.svg) {
    return 'data:image/svg+xml;base64,' + window.btoa(props.svg)
  }
  return ''
})

const loading = ref(false)

const styled = ref(props.restyle)

const styledSvgStyles = computed(() => {
  const width = props.attrs.size?.[0] ?? props.attrs.size
  const height = props.attrs.size?.[1] ?? props.attrs.size
  const styles: Record<string, string> = {
    width,
    'aspect-ratio': width / height + '',
  }
  if (props.attrs.rotation) {
    styles.transform = `rotate(${props.attrs.rotation}deg)`
  }
  if (props.attrs.color && styled.value) {
    Object.assign(styles, {
      'mask-image': `url('${src.value}')`,
      '-webkit-mask-image': `url('${src.value}')`,
      'background-color': props.attrs.color,
    })
  } else {
    Object.assign(styles, {
      'background-image': `url('${src.value}')`,
    })
  }
  return styles
})

watch(() => props.svg, v => {
  if (v) {
    expanded.value = true
    styled.value = props.restyle
  }
})

const check = (svg: string) => isFileExisted(props.attrs?.icon).catch(() => uploadFile(svg))

const copyVueComponent = () => {
  const svg = props.svg
  if (!svg) return
  loading.value = true
  check(svg)
    .then(() => {
      const attrs = props.attrs
      if (!props.restyle || !styled.value) {
        Reflect.deleteProperty(attrs, 'color')
      }
      return writeClipboard(generateVueCode(attrs))
    })
    .then(() => IpcUI.notify('copied vue component!'))
    .finally(() => loading.value = false)
}

const copyReactComponent = () => {
  const svg = props.svg
  if (!svg) return
  loading.value = true
  check(svg)
    .then(() => {
      const attrs = props.attrs
      if (!props.restyle || !styled.value) {
        Reflect.deleteProperty(attrs, 'color')
      }
      return writeClipboard(generateReactCode(attrs))
    })
    .then(() => IpcUI.notify('copied react component!'))
    .finally(() => loading.value = false)
}

const copyLink = () => {
  const svg = props.svg
  if (!svg) return
  loading.value = true
  check(svg)
    .then(() => writeClipboard(import.meta.env.VITE_APP_CDN_HOST + props.attrs?.icon + '.svg'))
    .then(() => IpcUI.notify('copied!'))
    .finally(() => loading.value = false)
}

const instance = getCurrentInstance()

// @ts-ignore
const id = computed(() => 'styled_' + instance.$uid)
</script>

<template>
  <div class="panel" :class="{ expanded, empty: !svg }">
    <div class="header" @click="expanded = !expanded">
      <div class="section-title">{{ title }}</div>
      <div class="btns">
        <div class="icon-button">
          <div class="icon icon--draft" @click.stop="copyVueComponent">V</div>
        </div>
        <div class="icon-button">
          <div class="icon icon--draft" @click.stop="copyReactComponent">R</div>
        </div>
        <div class="icon-button">
          <div class="icon icon--hyperlink" @click.stop="copyLink"></div>
        </div>
        <div class="collapse icon-button">
          <div class="icon icon--forward"></div>
        </div>
      </div>
    </div>
    <div v-show="expanded && svg" class="content">
      <div v-show="restyle" class="switch">
        <input :checked="styled" class="switch__toggle" type="checkbox" :id="id" @change="styled = !styled" />
        <label class="switch__label" :for="id">Restyle to instance</label>
      </div>
      <div class="preview">
        <div class="img" :style="styledSvgStyles" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.expanded {
  .collapse {
    transform: rotate(90deg);
  }
}
.empty {
  opacity: .4;
  pointer-events: none;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.btns {
  display: flex;
  align-items: center;
}

.content {
  margin-top: 6px;
}

.preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 120px;
  background-size: 10px 10px;
  background-position: 0 0, 5px 5px;
  background-image: 
      linear-gradient(45deg,#eee 25%,transparent 0,transparent 75%,#eee 0,#eee),
      linear-gradient(45deg, #eee 25%, #fff 0, #fff 75%, #eee 0, #eee);
}

.img {
  max-width: 100%;
  display: block;
  background-position: 0 0;
  background-size: 100%;
  background-repeat: no-repeat;
  mask-position: 0 0;
  -webkit-mask-position: 0 0;
  mask-size: 100%;
  -webkit-mask-size: 100%;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
}
</style>