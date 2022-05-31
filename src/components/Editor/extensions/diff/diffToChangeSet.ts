import { ChangeSet } from '@codemirror/state';

export type Change = {
  value: string,
  added: boolean,
  removed: boolean,
  count: number
};

export const diffToChangeSet = (diffs: Change[]) => {
  let offset = 0;

  const changes: any = [];

  for (const diff of diffs) {
    const {
      value, added, removed, count,
    } = diff;
    if (added) {
      changes.push({
        from: offset,
        to: offset,
        insert: value,
      });
    } else if (removed) {
      changes.push({
        from: offset,
        to: offset + count,
        insert: '',
      });
      offset += count;
    } else {
      offset += count;
    }
  }

  return ChangeSet.of(changes, offset);
};
