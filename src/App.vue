<template>
  <div class="ud-app">
    <div class="ud-app__header">
      <div class="ud-app__title">
        <h1>URL Decoder</h1>
      </div>
      <div
        class="ud-app-actions">
        <div class="ud-app-actions__item ud-app-actions__item--compare">
          <!-- compare -->
          <ud-icon name="compare" />
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
        :value="value"
        @update:value="updateValue" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import UdEditorAce from '@/components/UdEditorAce.vue'
import UdIcon from '@/components/UdIcon.vue'

export default defineComponent({
  name: 'App',
  components: {
    UdEditorAce,
    UdIcon
  },
  setup() {
    const value = ref<string>('')
    const IsHaveError = ref<boolean>(false)

    function updateValue(str: string) {
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
    display: flex;
    height: $header-height;
    padding: 0.5rem 1rem;
    position: fixed;
    width: 100%;
  }

  @include e(body) {
    flex-grow: 1;
    height: 100vh;
    padding-top: $header-height;
    width: 100vw;
  }

  @include e(title) {
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
