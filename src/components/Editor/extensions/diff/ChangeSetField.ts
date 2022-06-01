import { StateEffect, StateField, Transaction } from '@codemirror/state';

export class ChangeSetField {
  set = StateEffect.define();

  field: StateField<any>;

  constructor(getDefault) {
    this.field = StateField.define({
      create(state) {
        return getDefault(state);
      },
      update: (value, tr: Transaction) => {
        let result = value.map(tr.changes);
        for (const effect of tr.effects) {
          if (effect.is(this.set)) result = effect.value;
        }
        return result;
      },
    });
  }

  get extension() {
    return this.field;
  }

  setChangeSetEffect(changeSet) {
    return this.set.of(changeSet);
  }
}
