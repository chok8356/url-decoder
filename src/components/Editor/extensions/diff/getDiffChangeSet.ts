import { ChangeSet } from '@codemirror/state';
import DiffMatchPatch from 'diff-match-patch';

const d = new DiffMatchPatch();

type Change = [number, string];

type Range = {
  from: number,
  to: number,
  insert: string,
};

export const getDiffChangeSet = (src: string, dst: string): ChangeSet => {
  const diffs: Change[] = d.diff_main(src, dst);
  d.diff_cleanupSemantic(diffs);

  let offset = 0;

  const changes: Range[] = [];

  for (const diff of diffs) {
    const [type, value] = diff;

    const added = type === 1;
    const removed = type === -1;
    const count = value.length;

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
