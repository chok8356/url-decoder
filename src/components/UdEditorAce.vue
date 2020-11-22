<template>
  <div
    class="ud-editor-ace">
    <div
      ref="container"
      class="ud-editor-ace__container" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, reactive, ref, watch } from 'vue'
import 'ace-builds/src-min-noconflict/ace'
import 'ace-builds/src-min-noconflict/mode-json'
import 'ace-builds/src-min-noconflict/theme-xcode'

import { formatting, wait } from '@/helpers/utils'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ace = require('ace-builds/src-min-noconflict/ace')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsBeautify = require('js-beautify')

export enum Themes {
  light = 'ace/theme/xcode',
  dark = 'ace/theme/monokai'
}
export default defineComponent({
  name: 'UdEditorAce',
  props: {
    value: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '100%'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  emits: ['error', 'update:value'],
  setup(props, { emit }) {
    const container: any = ref<HTMLElement | null>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editor: any = reactive({})

    const options = reactive({
      mode: 'ace/mode/json',
      theme: Themes.light,
      fontSize: '12px',
      tabSize: 2,
      useWorker: false,
      wrap: true,
      showPrintMargin: false,
      selectionStyle: 'text',
      autoScrollEditorIntoView: true
    })

    function updateValue(str: string) {
      emit('update:value', str)
    }

    function change() {
      if (!editor.value) return
      const value = editor.value.getValue()
      updateValue(value)
    }

    function onPaste(text: string) {
      const formattedText = formatting(text)
      editor.value.execCommand('paste', formattedText)
      const textOriginal = editor.value.getValue()
      // eslint-disable-next-line @typescript-eslint/camelcase
      const beautifyText = jsBeautify(textOriginal, { indent_size: 2 })
      editor.value.setValue(beautifyText)
      editor.value.clearSelection()
    }

    function focus() {
      if (!editor.value) return
      if (editor.value.isFocused()) return
      editor.value.focus()
    }

    function init() {
      if (!container.value) return
      editor.value = ace.edit(container.value)
      editor.value.setOptions(options)
      editor.value.on('change', change)
      editor.value.onPaste = onPaste
      if (props.isActive) focus()
    }

    function destroy() {
      if (!editor.value) return
      editor.value.destroy()
      editor.value = null
    }

    async function resize() {
      if (!editor.value) return
      // wait container resize animation
      await wait(1)
      editor.value.resize(true)
    }

    watch(() => props.isActive, (value: boolean) => {
      if (value) focus()
    })

    watch(() => props.width, () => {
      resize()
    })

    onMounted(() => {
      init()
    })

    onBeforeUnmount(() => {
      destroy()
    })

    return {
      container
    }
  }
})
</script>

<style scoped lang="scss" vars="{ width }">
@include b(editor-ace) {
  height: 100%;
  outline: none;
  width: var(--width);

  @include e(container) {
    height: 100%;
    width: 100%;
  }
}
</style>
