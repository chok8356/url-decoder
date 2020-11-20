<template>
  <div class="ud-app">
    <div class="ud-app__header">
      <div class="ud-app__title">
        <h1>URL Decoder</h1>
      </div>
      <div
        v-if="IsHaveError"
        class="ud-app__error">
        Invalid JSON
      </div>
    </div>
    <div class="ud-app__body">
      <ud-editor-ace
        :value="value"
        @update:value="updateValue" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import UdEditorAce from '@/components/UdEditorAce.vue'

// TODO: Add JSON validation
// import { IsValidJson } from '@/helpers/utils'

export default defineComponent({
  name: 'App',
  components: {
    UdEditorAce
  },
  setup() {
    const value = ref<string>('')
    const IsHaveError = ref<boolean>(false)

    function updateValue(str: string) {
      // TODO: Add JSON validation
      // IsHaveError.value = !IsValidJson(str)
      value.value = str
    }

    return {
      value,
      updateValue,
      IsHaveError
    }
  }
})
</script>

<style scoped lang="scss">
@include b(app) {
  background: url('~@/assets/images/app-bg.png') center;
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
    display: flex;
    height: $header-height;
    padding: 0.5rem 2rem;
    position: fixed;
    width: 100%;
  }

  @include e(title) {
    flex-grow: 1;
  }

  @include e(error) {
    background-color: $color-white;
    border: 1px solid $color-black;
    box-shadow: $shadow-size  $shadow-size 0 #000;
    color: $color-danger;
    font-weight: 700;
    padding: 0.25rem 0.5rem;
    text-align: right;
  }

  @include e(body) {
    flex-grow: 1;
    height: 100vh;
    padding: $header-height 2rem 2rem;
    width: 100vw;
  }

  @include e(title) {
    h1 {
      margin: 0;
    }
  }
}

</style>
