import { ChangeSet } from '@codemirror/state';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Diff = require('diff');

type Change = {
  value: string,
  added: boolean,
  removed: boolean,
  count: number
};

type Range = {
  from: number,
  to: number,
  insert: string,
};

export const getDiffChangeSet = (src: string, dst: string): ChangeSet => {
  const diffs: Change[] = Diff.diffChars(src, dst);

  let offset = 0;

  const changes: Range[] = [];

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
