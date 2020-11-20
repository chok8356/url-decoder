<template>
  <div
    class="ud-editor-ace"
    :class="{'is-focused': isFocused}">
    <div
      ref="container"
      class="ud-editor-ace__container" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, reactive, ref } from 'vue'
import ace from 'ace-builds'
import 'ace-builds/webpack-resolver'
import { formatting } from '@/helpers/utils'

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
      type: [Object, Array, Number, String, Boolean],
      default: ''
    }
  },
  emits: ['error', 'update:value'],
  setup(props, { emit }) {
    const container: any = ref<HTMLElement | null>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editor: any = reactive({})
    const isFocused = ref<boolean>(false)

    const options = reactive({
      mode: 'ace/mode/json',
      theme: Themes.light,
      fontSize: '12px',
      tabSize: 2,
      useWorker: false,
      wrap: true,
      useSoftTabs: true,
      showPrintMargin: false,
      selectionStyle: 'text'
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
      isFocused.value = true
    }

    function blur() {
      isFocused.value = false
    }

    function init() {
      if (!container.value) return
      editor.value = ace.edit(container.value)
      editor.value.setOptions(options)
      editor.value.on('focus', focus)
      editor.value.on('blur', blur)
      editor.value.on('change', change)
      editor.value.onPaste = onPaste
    }

    function destroy() {
      if (!editor.value) return
      editor.value.destroy()
      editor.value = null
    }

    onMounted(() => {
      init()
    })

    onBeforeUnmount(() => {
      destroy()
    })

    return {
      container,
      editor,
      options,
      isFocused
    }
  }
})
</script>

<style scoped lang="scss">
@include b(editor-ace) {
  border: 1px solid $color-black;
  box-shadow: $shadow-size  $shadow-size 0 #000;
  height: 100%;
  outline: none;
  width: 100%;

  @include when(focused) {
    border-color: $color-primary;
    box-shadow: $shadow-size $shadow-size 0 $color-primary;
    outline: solid 1px $color-primary;
  }

  @include e(container) {
    height: 100%;
    width: 100%;
  }
}
</style>