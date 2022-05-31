<template>
  <div
    ref="div"
    :class="$style.editor" />
</template>

<script setup lang="ts">
// eslint-disable-next-line max-classes-per-file
import { EditorState, basicSetup } from '@codemirror/basic-setup';
import { insertTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import {
  EditorSelection, Extension, RangeSet, StateEffect, StateField, Transaction,
} from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import {
  EditorView, ViewUpdate, keymap, ViewPlugin, Decoration,
} from '@codemirror/view';
import {
  computed, onBeforeUnmount, onMounted, ref, watch,
} from 'vue';
import { diffSemantic } from './extensions/diff/diffSemantic';

interface Props {
  value: string,
  text?: string,
  dark: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  text: '',
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

class ChangeSetDecorations {
  changeSetField: any;

  decorations: any;

  widgets: any;

  constructor(view, widgets, changeSetField) {
    this.widgets = widgets;
    this.changeSetField = changeSetField;
    this.decorations = this._getDecorations(view);
  }

  _getDecorations(view) {
    const changeSet = view.state.field(this.changeSetField.field);
    const text = view.state.doc.toString();

    const ranges: any = [];

    changeSet.iterChanges((fromA, toA) => {
      // Deletion:
      if (fromA < toA) {
        const widget = this.widgets.diff(text.substring(fromA, toA));
        if (widget !== null) {
          ranges.push({
            from: fromA,
            to: toA,
            value: widget,
          });
        }
      }
    });

    return RangeSet.of(ranges, /* sort= */true);
  }

  update(update) {
    if (update.viewportChanged || update.docChanged
      || update.state?.field(this.changeSetField.field)
      !== update.prevState?.field(this.changeSetField.field)) {
      this.decorations = this._getDecorations(update.view);
    }
  }

  static makeExtension(widgets, changeSetField) {
    return ViewPlugin.define((view) => new ChangeSetDecorations(view, widgets, changeSetField), {
      decorations: (v) => v.decorations,
    });
  }
}

class ChangeSetField {
  set: any;

  field: StateField<any>;

  extension: StateField<any>;

  acceptAll: any;

  constructor(getDefault) {
    const set = StateEffect.define();
    this.set = set;
    this.field = StateField.define({
      create(state) {
        return getDefault(state);
      },
      update(value: any[], tr: Transaction) {
        let result: any = value.map(tr.changes as any);
        for (const effect of tr.effects) {
          if (effect.is(set)) {
            result = effect.value;
          }
        }
        return result;
      },
    });
    this.extension = this.field;
    /** @type {Command} */
    this.acceptAll = this._acceptAll.bind(this);
  }

  _acceptAll(target) {
    target.dispatch({ changes: target.field(this.field) });
    return true;
  }

  setChangeSetEffect(changeSet) {
    return this.set.of(changeSet);
  }

  static withString(string, diff = diffSemantic) {
    const updateDstView = function updateDstView(dstView, dstState) {
      const changeSet = diff(dstState.doc.toString(), string);
      dstView.dispatch({ effects: csf.setChangeSetEffect(changeSet) });
    };
    let csf = new ChangeSetField((dstState) => {
      return diff(dstState.doc.toString(), string);
    });
    return {
      changeSetField: csf,
      extension: [
        csf,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            updateDstView(update.view, update.state);
          }
        }),
      ],
    };
  }
}

// Extensions
const extensions = computed<Extension[]>(() => {
  const defaultStyle = EditorView.theme({
    '.cm-diff': {
      background: 'rgba(240, 255, 0, 0.25)',
    },
  });
  const ext = (string) => {
    if (!string) return [];

    const { changeSetField, extension } = ChangeSetField.withString(string);

    return [
      extension,
      ChangeSetDecorations.makeExtension({
        diff() { return Decoration.mark({ class: 'cm-diff' }); },
      }, changeSetField),
      defaultStyle,
      changeSetField,
    ];
  };

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
    EditorView.updateListener.of((view: ViewUpdate) => {
      emit('update:value', view.state.doc.toString());
    }),
    ext(props.text),
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
  editor,
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
