<template>
  <div :class="$style.root">
    <div :class="$style.actions">
      <template v-for="(action, index) in actions">
        <Icon
          v-if="action.show || action.show === undefined"
          :key="index"
          :class="$style.icon"
          :icon="action.icon"
          :title="action.title"
          @click="action.action ? action.action() : null" />
      </template>
    </div>
    <div
      ref="div"
      :class="$style.editor" />
  </div>
</template>

<script setup lang="ts">
import { indentMore, indentLess } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { EditorState, Extension, StateEffect } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, ViewUpdate, keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import {
  computed, onBeforeUnmount, onMounted, ref, watch,
} from 'vue';
import DecodeIcon from '../../assets/icons/decode.svg?raw';
import EncodeIcon from '../../assets/icons/encode.svg?raw';
import { beautify } from '../../utils/beautify';
import { QueryString } from '../../utils/QueryString';
import Icon from '../Icon.vue';

import { diff } from './extensions/diff';

interface Props {
  value: string,
  text?: string,
  light?: boolean
  decode?: boolean,
  formatting?: boolean,
  extractParam?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  text: '',
  light: false,
  decode: false,
  formatting: false,
  extractParam: false,
});

const emit = defineEmits(['update:value']);

const div = ref<HTMLDivElement>();

const editor = ref<EditorView>(new EditorView());

// Extensions
const extensions = computed<Extension[]>(() => [
  basicSetup,
  javascript(),
  keymap.of([{
    key: 'Tab',
    run: indentMore,
    preventDefault: true,
  }]),
  keymap.of([{
    key: 'Shift-Tab',
    run: indentLess,
    preventDefault: true,
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
  EditorView.updateListener.of((view: ViewUpdate) => {
    emit('update:value', view.state.doc.toString());
  }),
  EditorView.domEventHandlers({
    paste(e: ClipboardEvent, view: EditorView) {
      e.preventDefault();

      let pasted = e.clipboardData?.getData('Text') || '';

      if (props.decode) {
        pasted = QueryString.decodeFull(pasted);
      }

      if (props.extractParam) {
        pasted = QueryString.extractParam(pasted);
      }

      if (props.formatting) {
        pasted = beautify(pasted);
      }

      view.dispatch(view.state.replaceSelection(pasted));
    },
  }),
  props.light ? [] : oneDark,
  props.text ? diff(props.text) : [],
]);

const actions = computed(() => [
  {
    title: 'Decode',
    icon: DecodeIcon,
    action: decode,
    show: QueryString.canBeDecoded(props.value),
  },
  {
    title: 'Encode',
    icon: EncodeIcon,
    action: encode,
  },
]);

const decode = () => {
  // emit('update:value', decodeURIComponent(props.value));
  emit('update:value', QueryString.decode(props.value));
};

const encode = () => {
  // emit('update:value', encodeURIComponent(props.value));
  emit('update:value', QueryString.encode(props.value));
};

// Watchers
watch(() => props.value, async (current) => {
  const { doc } = editor.value.state;
  const { length } = doc;
  const text = doc.toString();

  if (text !== current) {
    editor.value.dispatch({
      changes: {
        from: 0,
        to: length,
        insert: current,
      },
    });
  }
});

watch(() => extensions.value, () => {
  editor.value.dispatch({
    effects: StateEffect.reconfigure.of(extensions.value),
  });
});

onMounted(async () => {
  editor.value = new EditorView({
    state: EditorState.create({
      doc: props.value,
      extensions: extensions.value,
    }),
    parent: div.value,
  });
});

onBeforeUnmount(() => {
  editor.value.destroy();
});

</script>

<style lang="scss" module>
.root {
  height: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.actions {
  bottom: 0.25rem;
  display: inline-flex;
  grid-gap: 0.5rem;
  padding: 0.25rem;
  position: absolute;
  right: 0.75rem;
  width: auto;
  z-index: 1;
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
