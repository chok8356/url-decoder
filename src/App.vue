<template>
  <div
    class="ud-app"
    :class="{'is-compare': isCompare === true}">
    <div class="ud-app__header">
      <div class="ud-app__title">
        <h1>URL Decoder</h1>
      </div>
      <div
        class="ud-app-actions">
        <div
          class="ud-app-actions__item ud-app-actions__item--compare"
          @click="changeCompare">
          <!-- compare -->
          <ud-icon
            name="compare"
            :active="isCompare === true" />
        </div>
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
      <ud-editor-ace
        v-model:value="valueLeft"
        :diff="markers.left"
        :is-active="!isCompare"
        :width="isCompare ? '50%' : '100%'"
        @init="(editor) => editors.left = editor" />
      <ud-editor-ace
        v-show="isCompare"
        v-model:value="valueRight"
        :diff="markers.right"
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
    const editors: any = reactive({
      left: null,
      right: null
    })
    const markers = ref(EMPTY_MARKERS)

    function changeCompare() {
      isCompare.value = !isCompare.value
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

    onMounted(() => {
      init()
    })

    return {
      valueLeft,
      valueRight,
      isCompare,
      editors,
      markers,
      changeCompare
    }
  }
})
</script>

<style scoped lang="scss">
@include b(app) {
  // background: url('~@/assets/images/app-bg.png') center;
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
    border-bottom: 1px solid $color-grey-2;
    display: flex;
    height: $header-height;
    padding: 0.5rem 1rem;
    position: fixed;
    width: 100%;
  }

  @include e(body) {
    display: flex;
    flex-grow: 1;
    height: 100%;
    padding-top: $header-height;
    width: 100%;
  }

  @include e(title) {
    flex-grow: 1;

    h1 {
      font-size: 1.5rem;
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
    background-color: $color-white;
    color: $color-black;
    cursor: pointer;
    display: inline-flex;
    width: auto;

    svg {
      height: 1.5rem;
      width: 1.5rem;
    }
  }
}
</style>
