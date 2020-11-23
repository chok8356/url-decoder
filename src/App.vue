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
          @click="isCompare = !isCompare">
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
    <div class="ud-app__body">
      <ud-editor-ace
        v-model:value="valueLeft"
        :diff="diffs.left"
        :is-active="!isCompare"
        :width="isCompare ? '50%' : '100%'"
        @init="(editor) => editors.left = editor" />
      <ud-editor-ace
        v-if="isCompare"
        v-model:value="valueRight"
        :diff="diffs.right"
        width="50%"
        @init="(editor) => editors.right = editor" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, reactive } from 'vue'
import UdEditorAce from '@/components/UdEditorAce.vue'
import UdIcon from '@/components/UdIcon.vue'
import { checkProperty } from '@/helpers/utils'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Diff = require('diff')

const FIND_OPTIONS = {
  wrap: true,
  caseSensitive: true,
  preventScroll: true
}

export default defineComponent({
  name: 'App',
  components: {
    UdEditorAce,
    UdIcon
  },
  setup() {
    const editors: any = reactive({
      left: {},
      right: {}
    })
    const valueLeft = ref<string>('')
    const valueRight = ref<string>('')
    const isCompare = ref<boolean>(true)
    const diffs = ref({
      left: {
        added: false,
        data: []
      },
      right: {
        added: true,
        data: []
      }
    })

    function getDiff(value1: string, value2: string) {
      if (!value1 || !value2) return []
      const diff = Diff.diffChars(value1, value2)

      const ranges: any = {
        left: {
          added: false,
          data: []
        },
        right: {
          added: true,
          data: []
        }
      }
      const offset = {
        left: 0,
        right: 0
      }
      for (const part of diff) {
        if (!checkProperty(part, 'added') && checkProperty(part, 'removed')) {
          offset.left += part.count
          offset.right += part.count
        } else if (part.added === true) {
          const range = editors.right.find(part.value, FIND_OPTIONS)
          ranges.right.data.push(range)
          offset.left += part.count
        } else if (part.removed === true) {
          const range = editors.left.find(part.value, FIND_OPTIONS)
          ranges.left.data.push(range)
          offset.right += part.count
        }
      }

      return ranges
    }

    watch([() => valueLeft.value, () => valueRight.value], () => {
      diffs.value = getDiff(valueLeft.value, valueRight.value)
    })

    return {
      valueLeft,
      valueRight,
      isCompare,
      editors,
      diffs
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
    border-bottom: 1px solid $color-grey;
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
