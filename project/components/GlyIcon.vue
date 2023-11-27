<script setup lang="ts">
  import { computed } from 'vue';

  interface Props {
    icon: string;
    size?: string | number | [string | number, string | number];
    color?: string;
    rotation?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    size: '1em',
    rotation: 0,
  });

  const HOST = import.meta.env.VITE_APP_ICON_HOST

  const wrapStyle = computed(() => {
    const w = Array.isArray(props.size) ? props.size[0] : props.size;
    const width = typeof w === 'number' ? w + 'px' : w;
    const h = Array.isArray(props.size) ? props.size[1] : props.size;
    const height = typeof h === 'number' ? h + 'px' : h;
    const rotation = props.rotation;
    return {
      width,
      height,
      'transform': `rotate(${rotation}deg)`,
      '-webkit-transform': `rotate(${rotation}deg)`,
    };
  });

  const iconStyle = computed(() => {
    const { color, icon } = props;
    const url = `${HOST}${icon}.svg`;
    if (color) {
      return {
        'mask-image': `url('${url}')`,
        '-webkit-mask-image': `url('${url}')`,
        'background-color': color,
      };
    }
    return {
      'background-image': `url('${url}')`,
    };
  });
</script>

<template>
  <div class="__wrap" :style="wrapStyle">
    <div class="__icon" :style="iconStyle"></div>
  </div>
</template>

<style lang="scss" scoped>
  .__wrap {
    display: inline-block;
    margin-bottom: -0.125em;
    overflow: hidden;
    position: relative;
  }
  .__icon {
    /* basic style */
    position: absolute;
    top: 0;
    left: 0;
    width: 500%;
    height: 500%;
    transform: scale(0.2);
    -webkit-transform: scale(0.2);
    transform-origin: left top;
    -webkit-transform-origin: left top;
    display: inline-block;
    background-repeat: no-repeat;
    background-size: 100%;
    mask-position: 0 0;
    -webkit-mask-position: 0 0;
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    mask-size: 100%;
    -webkit-mask-size: 100%;
  }
</style>
