<template>
  <div
    class="ud-app"
    :class="{ 'is-compare': isCompare === true }">
    <div class="ud-app__header">
      <div class="ud-app__title">
        <h1>URL Decoder</h1>
      </div>
      <div
        class="ud-app-actions">
        <!-- compare -->
        <div
          class="ud-app-actions__item ud-app-actions__item--compare"
          title="Compare"
          @click="changeCompare">
          <ud-icon
            name="compare"
            :active="isCompare === true" />
        </div>

        <!-- light/dark mode -->
        <div
          class="ud-app-actions__item ud-app-actions__item--compare"
          @click="isLight = !isLight">
          <ud-icon
            :active="isLight === true"
            name="sun" />
        </div>

        <!-- git link -->
        <a
          class="ud-app-actions__item ud-app-actions__item--github"
          href="https://github.com/chok8356/url-decoder"
          target="_blank">
          <ud-icon name="github" />
        </a>
      </div>
    </div>
    <div
      class="ud-app__body">
      <!-- left editor -->
      <ud-editor-ace
        v-model:value="valueLeft"
        :diff="markers.left"
        :is-light="isLight"
        :width="isCompare ? '50%' : '100%'"
        @init="(editor) => editors.left = editor" />

      <!-- right editor -->
      <ud-editor-ace
        v-show="isCompare"
        v-model:value="valueRight"
        :diff="markers.right"
        :is-light="isLight"
        width="50%"
        @init="(editor) => editors.right = editor" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, reactive, onMounted } from 'vue'
import UdEditorAce from '@/components/UdEditorAce.vue'
import UdIcon from '@/components/UdIcon.vue'
import { DIFF } from '@/helpers/diff'
import { LocalStorage } from '@/helpers/localStorage'
import { EMPTY_MARKERS } from '@/helpers/contants'

export default defineComponent({
  name: 'App',
  components: {
    UdEditorAce,
    UdIcon
  },
  setup() {
    const valueLeft = ref<string>(LocalStorage.getItem('valueLeft'))
    const valueRight = ref<string>(LocalStorage.getItem('valueRight'))
    const isCompare = ref<boolean>(false)
    const isLight = ref<boolean>(false)
    const markers = ref(EMPTY_MARKERS)
    const editors: any = reactive({
      left: null,
      right: null
    })

    watch(() => isLight.value, () => {
      if (isLight.value === true) {
        document.documentElement.setAttribute('data-theme', 'light')
      } else {
        document.documentElement.setAttribute('data-theme', 'dark')
      }
    })

    function changeFocusWhenCompare(value: boolean) {
      if (value === true) {
        editors.right.focus()
      } else {
        editors.left.focus()
      }
    }

    function changeCompare() {
      isCompare.value = !isCompare.value
      changeFocusWhenCompare(isCompare.value)
    }

    function getDiff() {
      if (isCompare.value === false) return EMPTY_MARKERS
      if (!valueLeft.value || !valueRight.value) return EMPTY_MARKERS
      return DIFF.getDiff(editors, valueLeft.value, valueRight.value)
    }

    function init() {
      if (LocalStorage.getItem('isCompare') === 'true') {
        isCompare.value = true
      }
      if (LocalStorage.getItem('isLight') === 'true') {
        isLight.value = true
      }
      editors.left.focus()
      editors.right.blur()
    }

    watch([() => valueLeft.value, () => valueRight.value], () => {
      LocalStorage.setItem('valueLeft', valueLeft.value)
      LocalStorage.setItem('valueRight', valueRight.value)
      markers.value = getDiff()
    })

    watch(() => isCompare.value, () => {
      if (isCompare.value === true) {
        markers.value = getDiff()
      } else {
        markers.value = EMPTY_MARKERS
      }
      LocalStorage.setItem('isCompare', isCompare.value)
    })

    watch(() => isLight.value, () => {
      LocalStorage.setItem('isLight', isLight.value)
    })

    onMounted(() => {
      init()
    })

    return {
      valueLeft,
      valueRight,
      isCompare,
      editors,
      markers,
      changeCompare,
      isLight
    }
  }
})
</script>

<style scoped lang="scss">
@include b(app) {
  color: #232323;
  display: flex;
  flex-direction: column;
  font-family: Consolas, monospace, sans-serif;
  font-size: $font-size;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  overflow-x: hidden;
  width: 100vw;

  @include e(header) {
    align-items: center;
    background-color: var(--color-header);
    border-bottom: 1px solid var(--color-grey);
    box-shadow: 0 0 0.5rem -0.25rem rgba(0, 0, 0, 0.2);
    display: flex;
    padding: 0.75rem 1.25rem;
    width: 100%;
    z-index: 5;
  }

  @include e(body) {
    display: flex;
    flex-grow: 1;
    height: 100%;
    width: 100%;
  }

  @include e(title) {
    flex-grow: 1;

    h1 {
      color: var(--color-title);
      font-size: 1.35rem;
      margin: 0;
    }
  }
}

@include b(app-actions) {
  align-items: center;
  display: inline-flex;
  margin-left: -0.5rem;
  width: auto;

  * {
    margin-left: 0.5rem;
  }

  @include e(item) {
    align-items: center;
    color: var(--color-icon);
    cursor: pointer;
    display: inline-flex;
    width: auto;

    svg {
      height: 1.25rem;
      width: 1.25rem;
    }
  }
}
</style>
