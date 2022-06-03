<template>
  <header :class="$style.header">
    <h1 :class="$style.title">
      URL Decoder
    </h1>
    <div :class="$style.actions">
      <div
        v-for="(actionGroup, index) in actions"
        :key="index"
        :class="$style.actionsGroup">
        <Icon
          v-for="(action, actionIndex) in actionGroup"
          :key="actionIndex"
          :class="[
            $style.icon, {
              [$style.iconActive]: action.active
            }
          ]"
          :icon="action.icon"
          :title="action.title"
          @click="action.action ? action.action() : null" />
      </div>
    </div>
  </header>
  <main :class="$style.main">
    <Editor
      v-model:value="text.left"
      :decode="settings.decode"
      :extract-param="settings.extractParam"
      :formatting="settings.formatting"
      :light="settings.light"
      :text="settings.compare ? text.right : ''" />
    <Editor
      v-if="settings.compare"
      v-model:value="text.right"
      :decode="settings.decode"
      :extract-param="settings.extractParam"
      :formatting="settings.formatting"
      :light="settings.light"
      :text="settings.compare ? text.left : ''" />
  </main>
</template>

<script setup lang="ts">
import {
  computed, onMounted, reactive, shallowReactive, watch,
} from 'vue';
import CompareIcon from './assets/icons/compare.svg?raw';
import DecodeIcon from './assets/icons/decode.svg?raw';
import ExtractIcon from './assets/icons/extract.svg?raw';
import FormatPageIcon from './assets/icons/format-page.svg?raw';
import FormatIcon from './assets/icons/format.svg?raw';
import GithubIcon from './assets/icons/github.svg?raw';
import SunIcon from './assets/icons/sun.svg?raw';
import Editor from './components/Editor/Editor.vue';
import Icon from './components/Icon.vue';
import { beautify } from './utils/beautify';
import { LocalStorage } from './utils/LocalStorage';

interface Settings {
  light: boolean,
  compare: boolean,
  decode: boolean,
  formatting: boolean,
  extractParam: boolean,
}

const settings = reactive<Settings>({
  light: false,
  compare: false,
  decode: true,
  formatting: true,
  extractParam: true,
});

const text = reactive({
  left: '',
  right: '',
});

const makeFormatting = () => {
  text.left = beautify(text.left);
  text.right = beautify(text.right);
};

const openGithubPage = () => {
  window.open('https://github.com/chok8356/url-decoder', '_blank');
};

const actions = computed(() => [
  [
    {
      title: 'Compare',
      icon: CompareIcon,
      active: settings.compare,
      action: () => settings.compare = !settings.compare,
    },
  ],
  [
    {
      title: 'Auto decode pasted text',
      icon: DecodeIcon,
      active: settings.decode,
      action: () => settings.decode = !settings.decode,
    },
    {
      title: 'Auto formatting pasted text',
      icon: FormatIcon,
      active: settings.formatting,
      action: () => settings.formatting = !settings.formatting,
    },
    {
      title: 'Auto extract params from pasted text',
      icon: ExtractIcon,
      active: settings.extractParam,
      action: () => settings.extractParam = !settings.extractParam,
    },
  ],
  [
    {
      title: 'Format all pages',
      icon: FormatPageIcon,
      action: makeFormatting,
    },
    {
      title: 'Theme',
      icon: SunIcon,
      active: settings.light,
      action: () => settings.light = !settings.light,
    },
    {
      title: 'Github',
      icon: GithubIcon,
      action: openGithubPage,
    },
  ],
]);

watch(() => settings, () => {
  LocalStorage.put('settings', settings);
  if (settings.light) {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}, { deep: true });

watch(() => text, () => {
  LocalStorage.put('text', text);
}, { deep: true });

onMounted(() => {
  Object.assign(settings, shallowReactive(LocalStorage.get('settings')));
  Object.assign(text, shallowReactive(LocalStorage.get('text')));
});
</script>

<style lang="scss">
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
  grid-gap: 1rem;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  width: 100%;
  z-index: 1;
}

.main {
  display: flex;
  height: 100%;
  overflow: hidden;
  width: 100%;
}

.title {
  color: var(--color-white);
  display: block;
  font-size: 1.35rem;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.actions {
  display: inline-flex;
  grid-gap: 2rem;
  width: auto;

  &Group {
    display: inline-flex;
    grid-gap: 1rem;
  }
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

.link {
  display: inline-flex;
  width: auto;
}

</style>
