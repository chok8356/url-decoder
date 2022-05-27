<template>
  <div :class="$style.app">
    <header :class="$style.header">
      <h1 :class="$style.title">
        URL Decoder
      </h1>
      <div :class="$style.actions">
        <Icon
          :class="$style.icon"
          :icon="CompareIcon"
          title="Compare" />
        <Icon
          :class="[
            $style.icon,
            {
              [$style.iconActive]: isLight
            }
          ]"
          :icon="SunIcon"
          title="Theme"
          @click="changeTheme" />
        <Icon
          :class="$style.icon"
          :icon="GithubIcon"
          title="Github"
          @click="openGithubPage" />
      </div>
    </header>
    <main>
      <Editor />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import CompareIcon from './assets/icons/compare.svg?raw';
import GithubIcon from './assets/icons/github.svg?raw';
import SunIcon from './assets/icons/sun.svg?raw';
import Editor from './components/Editor.vue';
import Icon from './components/Icon.vue';
import { LocalStorage } from './helpers/LocalStorage';

const isLight = ref<boolean>(false);

const changeTheme = () => {
  isLight.value = !isLight.value;
};

watch(() => isLight.value, () => {
  if (isLight.value) {
    document.documentElement.setAttribute('data-theme', 'light');
    LocalStorage.put('theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
    LocalStorage.delete('theme');
  }
});

const openGithubPage = () => {
  window.open('https://github.com/chok8356/url-decoder', '_blank');
};

onMounted(() => {
  if (LocalStorage.get('theme') === 'light') isLight.value = true;
});

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
  box-shadow: 0 0 0.5rem -0.25rem rgb(0 0 0 / 25%);
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
  display: inline-flex;
  grid-gap: 1rem;
}

.link {
  display: inline-flex;
  width: auto;
}

.icon {
  color: var(--color-light-grey);
  cursor: pointer;
  width: 1.25rem;

  &:hover {
    filter: brightness(125%);
  }

  &Active {
    color: var(--color-blue);
  }
}
</style>
