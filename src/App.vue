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
          $style.icon, {
            [$style.iconActive]: action.active
          }
        ]"
        :icon="action.icon"
        :title="action.title"
        @click="action.action ? action.action() : null" />
    </div>
  </header>
  <main :class="$style.main">
    <Editor
      ref="leftEditor"
      :dark="!isLight"
      :decode="isAutoDecode"
      :formatting="isAutoFormatting"
      :text="isCompare ? rightValue : ''"
      :value="leftValue"
      @update:value="onUpdateValueLeft" />
    <Editor
      v-show="isCompare"
      ref="rightEditor"
      :dark="!isLight"
      :decode="isAutoDecode"
      :formatting="isAutoFormatting"
      :text="isCompare ? leftValue : ''"
      :value="rightValue"
      @update:value="onUpdateValueRight" />
  </main>
</template>

<script setup lang="ts">
import {
  computed, nextTick, onMounted, ref, watchEffect,
} from 'vue';
import CompareIcon from './assets/icons/compare.svg?raw';
import DecodeIcon from './assets/icons/decode.svg?raw';
import FormatPageIcon from './assets/icons/format-page.svg?raw';
import FormatIcon from './assets/icons/format.svg?raw';
import GithubIcon from './assets/icons/github.svg?raw';
import SunIcon from './assets/icons/sun.svg?raw';
import Editor from './components/Editor/Editor.vue';
import Icon from './components/Icon.vue';
import { LocalStorage } from './utils/LocalStorage';

const isLight = ref<boolean>(LocalStorage.get('isLight'));
const isCompare = ref<boolean>(LocalStorage.get('isCompare'));
const isAutoDecode = ref<boolean>(LocalStorage.get('isAutoDecode'));
const isAutoFormatting = ref<boolean>(LocalStorage.get('isAutoFormatting'));

const leftValue = ref<string>(LocalStorage.get('leftValue'));
const leftEditor = ref<InstanceType<typeof Editor> | null>(null);

const rightValue = ref<string>(LocalStorage.get('rightValue'));
const rightEditor = ref<InstanceType<typeof Editor> | null>(null);

const beautify = require('js-beautify').js;

const changeCompare = async () => {
  isCompare.value = !isCompare.value;
  await nextTick();
  const editor = isCompare.value ? rightEditor.value : leftEditor.value;
  editor?.focus();
  LocalStorage.put('isCompare', isCompare.value);
};

const changeTheme = () => {
  isLight.value = !isLight.value;
  LocalStorage.put('isLight', isLight.value);
};

const changeAutoDecode = () => {
  isAutoDecode.value = !isAutoDecode.value;
  LocalStorage.put('isAutoDecode', isAutoDecode.value);
};

const changeAutoFormatting = () => {
  isAutoFormatting.value = !isAutoFormatting.value;
  LocalStorage.put('isAutoFormatting', isAutoFormatting.value);
};

const makeFormatting = () => {
  leftValue.value = beautify(leftValue.value, { indent_size: 2 });
  rightValue.value = beautify(rightValue.value, { indent_size: 2 });
};

const openGithubPage = () => {
  window.open('https://github.com/chok8356/url-decoder', '_blank');
};

const actions = computed(() => [
  {
    title: 'Compare',
    icon: CompareIcon,
    active: isCompare.value,
    action: changeCompare,
  },
  {
    title: 'Make formatting all pge',
    icon: FormatPageIcon,
    action: makeFormatting,
  },
  {
    title: 'Auto decode pasted text',
    icon: DecodeIcon,
    active: isAutoDecode.value,
    action: changeAutoDecode,
  },
  {
    title: 'Auto formatting pasted text',
    icon: FormatIcon,
    active: isAutoFormatting.value,
    action: changeAutoFormatting,
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

const onUpdateValueLeft = (value: string) => {
  leftValue.value = value;
  LocalStorage.put('leftValue', leftValue.value);
};

const onUpdateValueRight = (value: string) => {
  rightValue.value = value;
  LocalStorage.put('rightValue', rightValue.value);
};

watchEffect(() => {
  if (isLight.value) {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
});

onMounted(async () => {
  leftEditor.value?.focus();
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
  font-size: 1.35rem;
  margin: 0;
}

.actions {
  display: inline-flex;
  grid-gap: 1rem;
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
