import { EditorView } from '@codemirror/view';
import { ChangeSetDecorations } from './ChangeSetDecorations';
import { ChangeSetField } from './ChangeSetField';
import { getDiffChangeSet } from './getDiffChangeSet';

export const diff = (string) => {
  if (!string) return [];

  const changeSetField = new ChangeSetField((dstState) => {
    return getDiffChangeSet(dstState.doc.toString(), string);
  });

  const extension = [
    changeSetField,
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const changeSet = getDiffChangeSet(update.state.doc.toString(), string);
        update.view.dispatch({ effects: changeSetField.setChangeSetEffect(changeSet) });
      }
    }),
  ];

  const decoration = ChangeSetDecorations.makeExtension(changeSetField);

  return [
    extension,
    decoration,
  ];
};
