<template>
  <div
    ref="div"
    :class="$style.editor" />
</template>

<script setup lang="ts">
import { EditorState, basicSetup } from '@codemirror/basic-setup';
import { insertTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { EditorSelection, Extension, StateEffect } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, ViewUpdate, keymap } from '@codemirror/view';
import {
  computed, onBeforeUnmount, onMounted, ref, watch,
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

const div = ref<HTMLDivElement>();

const editor = ref<EditorView>(new EditorView());

// Init methods
const init = () => {
  editor.value = new EditorView({
    state: EditorState.create({
      doc: props.value,
      extensions: extensions.value,
    }),
    parent: div.value,
  });
};

const destroy = () => editor.value.destroy();

// Extensions
const extensions = computed<Extension[]>(() => {
  const result = [
    basicSetup,
    javascript(),
    keymap.of([{
      key: 'Tab',
      run: insertTab,
    }]),
    EditorState.tabSize.of(2),
    EditorView.lineWrapping,
    EditorView.theme({
      '&': {
        fontSize: '9pt',
      },
      '.cm-gutters': {
        border: 'none',
        background: 'var(--color-grey)',
      },
    }),
    EditorView.updateListener.of((update: ViewUpdate) => {
      emit('update:value', update.state.doc.toString());
    }),
  ];
  if (props.dark) result.push(oneDark);
  return result;
});

// Focus
const focus = () => {
  editor.value.focus();
};

// Watchers
watch(() => props.value, async (current) => {
  const { length } = editor.value.state.doc;

  let selection = editor.value.state.selection.ranges[0].from;
  if (selection > current.length) selection = current.length;

  editor.value.dispatch({
    changes: {
      from: 0,
      to: length,
      insert: current,
    },
    selection: EditorSelection.single(selection),
  });
});

watch(() => extensions.value, () => {
  editor.value.dispatch({
    effects: StateEffect.reconfigure.of(extensions.value),
  });
});

onMounted(async () => {
  init();
});

onBeforeUnmount(() => {
  destroy();
});

defineExpose({
  focus,
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
