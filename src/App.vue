<script setup lang="ts">
import { hash } from '../server/utils';
import { computed } from 'vue'
import IconPanel from './components/IconPanel.vue';
import state from './state'

const rootAttrs = computed(() => {
  if (!state.selected) return {}
  const w = state.selected.width
  const h = state.selected.height
  return {
    FIGMA_KEY: state.selected.FIGMA_KEY,
    name: state.selected.name,
    icon: hash(state.selected?.root ?? ''),
    size: w === h ? w : [w, h],
    color: state.selected.styles.color,
    rotation: state.selected.styles.rotation,
  }
})

const instanceAttrs = computed(() => {
  if (!state.selected) return {}
  const w = state.selected.width
  const h = state.selected.height
  return {
    name: state.selected.name,
    icon: hash(state.selected.instance ?? ''),
    size: w === h ? w : [w, h],
  }
})
</script>

<template>
  <main>
    <div class="section-title">{{ state.selected?.name ?? 'Unselected' }}</div>
    <div class="meta">
      <p>{{ state.selected?.FIGMA_KEY }}</p>
    </div>
    <span class="divider" />
    <IconPanel restyle class="mb-6" title="Component Class" :svg="state.selected?.root" :attrs="rootAttrs" />
    <IconPanel class="mb-6" title="Component Instance" :svg="state.selected?.instance" :attrs="instanceAttrs" />
  </main>
</template>

<style lang="less" scoped>
main {
  padding: 8px;
  min-height: 100%;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.mb-6 {
  margin-bottom: 6px;
}

.meta {
  font-size: 12px;
  padding: 0 calc(var(--size-xxsmall) / 2) 0 var(--size-xxsmall);
  font-size: var(--font-size-xsmall);
  font-weight: var(--font-weight-normal);
  letter-spacing: var(--font-letter-spacing-pos-xsmall);
  line-height: var(--line-height);
  color: var(--black3);
  margin-bottom: 12px;
  
  p {
    margin-top: 0;
    margin-bottom: .5em;
  }
}
</style>
