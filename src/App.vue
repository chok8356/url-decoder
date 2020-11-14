<template>
  <div class="ud-app">
    <div class="ud-app__header">
      <div class="ud-app__title">
        <h1>URL Decoder</h1>
      </div>
    </div>
    <div class="ud-app__body">
      <textarea
        cols="30"
        rows="10" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  components: {
  }
})
</script>

<style scoped lang="scss">
@include b(app) {
  // background: url('~@/assets/images/app-bg.png') center;
  color: #232323;
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
    padding: 0.5rem 2rem;
  }

  @include e(title) {
    h1 {
      margin: 0;
    }
  }
}

</style>
