<template>
  <div class="ud-editor">
    <textarea
      ref="textarea"
      rows="10"
      :value="value"
      class="ud-editor__textarea"
      @input="(event) => updateValue(event.target.value)"
      @paste="onPaste" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import { formatting, getInsertedText } from '@/helpers/utils'

export default defineComponent({
  name: 'UdEditor',
  props: {
    value: {
      type: [Object, Array, Number, String, Boolean],
      default: ''
    }
  },
  emits: ['error', 'update:value'],
  setup(props, { emit }) {
    const textarea = ref()
    function updateValue(str: string) {
      emit('update:value', str)
    }

    function onError(error: string) {
      alert(error)
      emit('error', error)
    }

    function onPaste(event: ClipboardEvent) {
      event.preventDefault()

      if (!textarea.value) return

      const { clipboardData } = event

      if (!clipboardData) return

      const textData = clipboardData?.getData('text')

      if (!textData) return

      const { value, error } = formatting(textData)

      if (error) onError(error)

      const fullText = getInsertedText(textarea.value, value)

      if (!fullText) return

      updateValue(fullText)
    }

    return {
      textarea,
      updateValue,
      onPaste
    }
  }
})
</script>

<style scoped lang="scss">

$shadow-size: 0.25rem;

@include b(editor) {
  display: block;
  height: 100%;
  width: 100%;

  @include e(container) {
    height: 100%;
    width: 100%;
  }

  @include e(textarea) {
    border: 1px solid $color-black;
    box-shadow: $shadow-size  $shadow-size 0 #000;
    font-size: 0.8rem;
    height: 100%;
    outline: none;
    padding: 0;
    resize: none;
    width: 100%;

    &:focus {
      border-color: $color-primary;
      box-shadow: $shadow-size $shadow-size 0 $color-primary;
      outline: solid 1px $color-primary;
    }
  }
}
</style>
