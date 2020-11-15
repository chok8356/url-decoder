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

    function decode(str: string) {
      if (!str) return ''
      return decodeURIComponent(str)
    }

    function getUrlVars(url: string) {
      let hash
      const result: any = {}
      const hashes = url.slice(url.indexOf('?') + 1).split('&')
      for (let i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=')
        result[hash[0]] = hash[1]
      }
      return result
    }

    function parse(str: string) {
      let json: any = {}
      let error = null
      if (!str) {
        return {
          json,
          error
        }
      }
      try {
        json = JSON.parse(str)
        if (json && Object.keys(json)?.length) {
          for (const key in json) {
            const data = json[key]
            if (data) {
              const { json: obj, error } = parse(data)
              if (!error) json[key] = obj
            }
          }
        }
      } catch (err) {
        error = err
      }
      return {
        json,
        error
      }
    }

    function stringify(json: any) {
      let str = ''
      let error = null
      if (!json) {
        return {
          str,
          error
        }
      } try {
        str = JSON.stringify(json, undefined, 2)
      } catch (err) {
        error = err
      }
      return {
        str,
        error
      }
    }

    function onPaste(event: ClipboardEvent) {
      event.preventDefault()
      if (!textarea.value) return

      const { clipboardData } = event

      if (!clipboardData) return

      const textData = clipboardData?.getData('text')

      if (!textData) return

      const text = JSON.stringify(getUrlVars(decode(textData)))
      const { json, error: parseError } = parse(text)

      if (parseError) return updateValue('')

      const { str, error: stringifyError } = stringify(json)

      if (stringifyError) return updateValue('')

      updateValue(str)
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
