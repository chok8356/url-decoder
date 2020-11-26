<template>
  <svg
    :class="classes"
    :width="size"
    :height="size"
    v-bind="$attrs"
    aria-hidden="true">
    <use :xlink:href="`#icon-${name}`" />
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

const requireAll: any = (requireContext: any) => requireContext.keys().map(requireContext)
const req = require.context('@/assets/icons/', true, /\.svg$/)
requireAll(req)

export default defineComponent({
  name: 'UdIcon',
  props: {
    name: {
      type: String,
      default: '',
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },
    size: {
      type: [String, Number],
      default: '1rem'
    }
  },
  setup(props) {
    const classes = computed(() => {
      return [
        'ud-icon',
        {
          'is-active': props.active
        }
      ]
    })
    return {
      classes
    }
  }
})
</script>

<style lang="scss">
@include b(icon) {
  color: currentColor;
  fill: none;

  @include when(active) {
    color: var(--color-primary);
  }
}
</style>
