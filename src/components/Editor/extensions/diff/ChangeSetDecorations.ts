import { RangeSet } from '@codemirror/state';
import { Decoration, EditorView, ViewPlugin } from '@codemirror/view';
import { ChangeSetField } from './ChangeSetField';

type Range = {
  from: number,
  to: number,
  value: Decoration,
};

export class ChangeSetDecorations {
  changeSetField: ChangeSetField;

  decorations: RangeSet<Decoration>;

  constructor(view, changeSetField) {
    this.changeSetField = changeSetField;
    this.decorations = this._getDecorations(view);
  }

  _getDecorations(view) {
    const changeSet = view.state.field(this.changeSetField.field);

    const ranges: Range[] = [];

    changeSet.iterChanges((fromA, toA) => {
      if (fromA < toA) {
        ranges.push({
          from: fromA,
          to: toA,
          value: Decoration.mark({ class: 'cm-diff' }),
        });
      }
    });

    return RangeSet.of(ranges, true);
  }

  update(update) {
    if (update.viewportChanged || update.docChanged
      || update.state?.field(this.changeSetField.field)
      !== update.prevState?.field(this.changeSetField.field)) {
      this.decorations = this._getDecorations(update.view);
    }
  }

  static makeExtension(changeSetField) {
    return [
      EditorView.theme({
        '.cm-diff': {
          background: 'rgb(60 255 147 / 25%)',
        },
      }),
      ViewPlugin.define(
        (view) => new ChangeSetDecorations(view, changeSetField),
        { decorations: (x) => x.decorations },
      ),
    ];
  }
}
