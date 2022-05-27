<template>
  <div
    ref="div"
    :class="$style.editor" />
</template>

<script setup lang="ts">
import { EditorState, basicSetup } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';
import { Extension, StateEffect } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, ViewUpdate } from '@codemirror/view';
import {
  computed, onMounted, ref, watch,
} from 'vue';

interface Props {
  value: string,
  dark: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  dark: false,
});

const emit = defineEmits(['update:value']);

const themes = {
  dark: oneDark,
  font: EditorView.theme({
    '&': {
      fontSize: '9pt',
    },
    '.cm-gutters': {
      border: 'none',
      background: 'transparent',
    },
  }),
};

const div = ref<HTMLDivElement>();

const view = ref<EditorView>(new EditorView());

const extensions = computed<Extension[]>(() => {
  const result = [
    basicSetup,
    javascript(),
    EditorView.lineWrapping,
    EditorView.updateListener.of((update: ViewUpdate) => {
      emit('update:value', update.state.doc.toString());
    }),
  ];
  if (props.dark) result.push(themes.dark);
  result.push(themes.font);
  return result;
});

watch(() => props.value, () => {
  view.value.dispatch({
    changes: {
      from: 0,
      to: view.value.state.doc.length,
      insert: props.value,
    },
  });
});

watch(() => extensions.value, () => {
  view.value.dispatch({
    effects: StateEffect.reconfigure.of(extensions.value),
  });
});

onMounted(async () => {
  view.value = new EditorView({
    state: EditorState.create({
      doc: props.value,
      extensions: extensions.value,
    }),
    parent: div.value,
  });
});
</script>

<style lang="scss" module>
.editor {
  height: 100%;
  overflow: auto;
  width: 100%;

  & > div {
    height: 100%;
    width: 100%;
  }
}

</style>
