import { ChangeSet } from '@codemirror/state';
// import DiffMatchPatch from 'diff-match-patch';
import { diffToChangeSet } from './diffToChangeSet';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Diff = require('diff');

export const diffSemantic = (src: string, dst: string): ChangeSet => {
  return diffToChangeSet(Diff.diffChars(src, dst));
};
