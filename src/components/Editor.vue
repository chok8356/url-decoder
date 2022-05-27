<template>
  <div :class="$style.editors">
    <div ref="editor1" />
    <div ref="editor2" />
  </div>
</template>

<script setup lang="ts">
import { EditorState, basicSetup } from '@codemirror/basic-setup';
import { Transaction, Annotation } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { onMounted, ref } from 'vue';

const editor1 = ref<HTMLDivElement>();
const editor2 = ref<HTMLDivElement>();

const views = ref<EditorView[]>([]);
const syncAnnotation = ref(Annotation.define<boolean>());

const state = ref<EditorState>();

const syncDispatch = (from: number, to: number) => (tr: Transaction) => {
  views.value[from].update([tr]);
  if (!tr.changes.empty && !tr.annotation(syncAnnotation.value)) {
    views.value[to].dispatch({
      changes: tr.changes,
      annotations: syncAnnotation.value.of(true),
    });
  }
};

onMounted(() => {
  state.value = EditorState.create({
    doc: 'The document\nis\nshared',
    extensions: basicSetup,
  });

  views.value.push(
    new EditorView({
      state: state.value,
      parent: editor1.value,
      dispatch: syncDispatch(0, 1),
    }),
    new EditorView({
      state: state.value,
      parent: editor2.value,
      dispatch: syncDispatch(1, 0),
    }),
  );
});
</script>

<style lang="scss" module>
.editors {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
</style>
