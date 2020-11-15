<template>
  <div class="ud-app">
    <div class="ud-app__header">
      <div class="ud-app__title">
        <h1>URL Decoder</h1>
      </div>
    </div>
    <div class="ud-app__body">
      <ud-editor v-model:value="value" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import UdEditor from '@/components/UdEditor.vue'

export default defineComponent({
  name: 'App',
  components: {
    UdEditor
  },
  setup() {
    const value = ref('')

    return {
      value
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
  font-family: monospace, sans-serif;
  font-size: $font-size;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  overflow-x: hidden;
  width: 100vw;

  @include e(header) {
    display: block;
    // height: $header-height;
    padding: 0.5rem 2rem;
    width: 100%;
  }

  @include e(body) {
    flex-grow: 1;
    padding: 0 2rem 2rem;
  }

  @include e(title) {
    h1 {
      margin: 0;
    }
  }
}

</style>
