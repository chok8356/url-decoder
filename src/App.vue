<template>
  <header :class="$style.header">
    <h1 :class="$style.title">
      URL Decoder
    </h1>
    <div :class="$style.actions">
      <Icon
        v-for="(action, index) in actions"
        :key="index"
        :class="[
          $style.icon,
          {
            [$style.iconActive]: action.active
          }
        ]"
        :icon="action.icon"
        :title="action.title"
        @click="action.action ? action.action() : null" />
    </div>
  </header>
  <main :class="$style.main">
    <button @click="valueLeft = '111111'">
      test
    </button>
    <Editor
      v-model:value="valueLeft"
      :dark="!isLight" />
  </main>
</template>

<script setup lang="ts">
import {
  computed, onMounted, ref, watch,
} from 'vue';
import CompareIcon from './assets/icons/compare.svg?raw';
import GithubIcon from './assets/icons/github.svg?raw';
import SunIcon from './assets/icons/sun.svg?raw';
import Editor from './components/Editor.vue';
import Icon from './components/Icon.vue';
import { LocalStorage } from './helpers/LocalStorage';

const valueLeft = ref<string>(LocalStorage.get('valueLeft'));
const isLight = ref<boolean>(false);

watch(() => isLight.value, () => {
  if (isLight.value) {
    document.documentElement.setAttribute('data-theme', 'light');
    LocalStorage.put('theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
    LocalStorage.delete('theme');
  }
});

const changeTheme = () => {
  isLight.value = !isLight.value;
};

const openGithubPage = () => {
  window.open('https://github.com/chok8356/url-decoder', '_blank');
};

const actions = computed(() => [
  {
    title: 'Compare',
    icon: CompareIcon,
  },
  {
    title: 'Theme',
    icon: SunIcon,
    active: isLight.value,
    action: changeTheme,
  },
  {
    title: 'Github',
    icon: GithubIcon,
    action: openGithubPage,
  },
]);

onMounted(async () => {
  if (LocalStorage.get('theme') === 'light') isLight.value = true;

  // await new Promise((resolve) => {
  //   setTimeout(() => resolve(true), 2000);
  // });
  //
  // valueLeft.value = '111';
});

</script>

<style lang="scss">
html,
body {
  margin: 0;
  overflow: hidden;
  padding: 0;
}

* {
  box-sizing: border-box;
}

#app {
  display: grid;
  font-family: var(--font-family);
  font-size: var(--font-size);
  grid-auto-rows: auto 1fr;
  height: 100vh;
  overflow: hidden;
  width: 100vw;
}
</style>

<style lang="scss" module>
.header {
  align-items: center;
  background-color: var(--color-grey);
  box-shadow: 0 0 0.25rem 0.1rem rgb(0 0 0 / 20%);
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  width: 100%;
  z-index: 1;
}

.main {
  height: 100%;
  overflow: hidden;
  width: 100%;
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
