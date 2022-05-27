<template>
  <div :class="$style.app">
    <header :class="$style.header">
      <h1 :class="$style.title">
        URL Decoder
      </h1>
      <div :class="$style.actions">
        <!--icon-->
        <Icon />
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import Icon from './components/IconSvg.vue';

</script>

<style lang="scss" module>
html,
body {
  margin: 0;
  overflow: hidden;
  padding: 0;
}

* {
  box-sizing: border-box;
}

.app {
  font-family: var(--font-family);
  font-size: var(--font-size);
  height: 100vh;
  overflow-x: hidden;
  width: 100vw;
}

.header {
  align-items: center;
  background-color: var(--color-grey);
  box-shadow: 0 0 0.5rem -0.25rem rgb(0 0 0 / 20%);
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  width: 100%;
  z-index: 1;
}

.title {
  color: var(--color-white);
  font-size: 1.35rem;
  margin: 0;
}

.actions {
  display: inline-grid;
  grid-gap: 0.5rem;
}
</style>
