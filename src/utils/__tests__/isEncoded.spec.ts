import { isCanBeDecoded } from '../isCanBeDecoded';

const strEncoded = '%7B1%7D';
const str = '{1}';

describe('Util: isCanBeDecoded', () => {
  it('true', () => {
    expect(isCanBeDecoded(strEncoded)).toBeTruthy();
  });

  it('false', () => {
    expect(isCanBeDecoded(str)).toBeFalsy();
  });
});
