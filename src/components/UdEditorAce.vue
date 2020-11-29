<template>
  <div
    class="ud-editor-ace"
    :style="{ width: width }">
    <div
      ref="container"
      class="ud-editor-ace__container" />
    <div class="ud-editor-ace__actions ud-editor-ace-actions">
      <div
        v-if="isShowDecodeButton"
        class="ud-editor-ace-actions__item"
        title="Decode">
        <ud-icon
          name="decode"
          @click="decodeValue" />
      </div>
      <div
        v-if="value"
        class="ud-editor-ace-actions__item"
        title="Encode">
        <ud-icon
          name="encode"
          @click="encodeValue" />
      </div>
      <div
        v-if="value"
        class="ud-editor-ace-actions__item"
        title="Format">
        <ud-icon
          name="format"
          @click="formatValue" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'
import UdIcon from '@/components/UdIcon.vue'
import ace from 'ace-builds'
import 'ace-builds/src-min-noconflict/mode-json'
import 'ace-builds/src-min-noconflict/theme-xcode'
import 'ace-builds/src-min-noconflict/theme-monokai'
import { decodeAndFormat, wait, getBeautifyText, decode, encode, isEncoded } from '@/helpers/utils'

const Range = ace.Range

export enum Themes {
  light = 'ace/theme/xcode',
  dark = 'ace/theme/monokai'
}
export default defineComponent({
  name: 'UdEditorAce',
  components: {
    UdIcon
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    diff: {
      type: Object,
      default: () => ({})
    },
    width: {
      type: String,
      default: '100%'
    },
    isLight: {
      type: Boolean,
      default: false
    }
  },
  emits: ['init', 'update:value'],
  setup(props, { emit }) {
    const container: any = ref<HTMLElement | null>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editor: any = ref({})

    const isShowDecodeButton = computed(() => {
      if (!props.value) return false
      return isEncoded(props.value)
    })

    const isShowEncodeButton = computed(() => {
      if (!props.value) return false
      return !isEncoded(props.value)
    })

    const options = {
      mode: 'ace/mode/json',
      theme: props.isLight ? Themes.light : Themes.dark,
      fontSize: '12px',
      tabSize: 2,
      useWorker: false,
      wrap: true,
      showPrintMargin: false,
      selectionStyle: 'text',
      autoScrollEditorIntoView: true
    }

    /**
     * THEME
     */
    function changeTheme() {
      if (!editor.value) return
      editor.value.setTheme(props.isLight === true ? Themes.light : Themes.dark)
    }

    watch(() => props.isLight, () => {
      changeTheme()
    })

    /**
     * EDITOR VALUE
     */
    function updateValue(str: string) {
      emit('update:value', str)
    }

    function getEditorValue() {
      return editor.value.getValue()
    }

    function setEditorValue(value: string) {
      editor.value.setValue(value)
      editor.value.clearSelection()
    }

    function change() {
      if (!editor.value) return
      const value = getEditorValue()
      updateValue(value)
    }

    function formatValue() {
      const text = getEditorValue()
      const beautifyText = getBeautifyText(text)
      setEditorValue(beautifyText)
    }

    function decodeValue() {
      const text = getEditorValue()
      const decodedText = decode(text)
      setEditorValue(decodedText)
    }

    function encodeValue() {
      const text = getEditorValue()
      const encodedText = encode(text)
      setEditorValue(encodedText)
    }

    function onPaste(text: string) {
      const formattedText = decodeAndFormat(text)
      editor.value.execCommand('paste', formattedText)
      // eslint-disable-next-line @typescript-eslint/camelcase
      formatValue()
    }

    function focus() {
      if (!editor.value) return
      if (editor.value.isFocused()) return
      editor.value.focus()
    }

    /**
     * EDITOR INSTANCE
     */
    function init() {
      if (!container.value) return
      editor.value = ace.edit(container.value)
      editor.value.setOptions(options)
      if (props.value !== undefined) {
        editor.value.setValue(props.value)
        editor.value.clearSelection()
      }
      editor.value.on('change', change)
      editor.value.onPaste = onPaste
      focus()
      emit('init', editor.value)
    }

    function destroy() {
      if (!editor.value) return
      updateValue('')
      editor.value.destroy()
      editor.value = null
    }

    async function resize() {
      if (!editor.value) return
      // wait container resize animation
      await wait(1)
      editor.value.resize(true)
    }

    /**
     * COMPARE DIFF
     */
    function clearDiff() {
      const markers = editor.value.getSession().getMarkers()
      for (const key in markers) {
        editor.value.getSession().removeMarker(key)
      }
      editor.value.updateSelectionMarkers()
    }

    function showDiff() {
      if (!props.diff.data?.length) return
      const extraClass = props.diff?.class ? `ud-editor-ace-diff-line--${props.diff?.class}` : ''
      for (const range of props.diff.data) {
        const { startLine, startChar, endLine, endChar }: any = range
        editor.value.getSession().addMarker(
          new Range(startLine, startChar, endLine, endChar),
          `ud-editor-ace-diff-line ${extraClass}`,
          'text'
        )
      }
    }

    watch(() => props.width, () => {
      resize()
    })

    watch(() => props.diff, () => {
      clearDiff()
      showDiff()
    })

    onMounted(() => {
      init()
    })

    onBeforeUnmount(() => {
      destroy()
    })

    return {
      container,
      formatValue,
      decodeValue,
      encodeValue,
      isShowDecodeButton,
      isShowEncodeButton
    }
  }
})
</script>

<style scoped lang="scss">
@include b(editor-ace) {
  height: 100%;
  outline: none;
  position: relative;
  width: 100%;

  @include e(container) {
    height: 100%;
    width: 100%;
    z-index: 0;
  }

  @include e(actions) {
    bottom: 0.5rem;
    position: absolute;
    right: 1.5rem;
    z-index: 1;
  }
}

@include b(editor-ace-actions) {
  align-items: center;
  display: inline-flex;
  height: auto;
  justify-content: flex-end;
  margin-left: -0.5rem;
  width: auto;

  @include e(item) {
    color: var(--color-icon);
    cursor: pointer;
    display: inline-flex;
    font-size: 1rem;
    height: auto;
    line-height: 1;
    margin-left: 0.5em;
    white-space: nowrap;
    width: auto;

    &:hover {
      color: var(--color-primary);
    }

    svg {
      height: 1.25rem;
      width: 1.25rem;
    }
  }
}
</style>

<style lang="scss">

%editor-ace-diff {
  border-radius: 0.125rem;
  position: absolute;
  z-index: 4;
}

@include b(editor-ace-diff-line) {
  background-color: var(--color-selection);

  @extend %editor-ace-diff;

  @include m(right) {
    background-color: var(--color-selection-removed);
  }
}
</style>
