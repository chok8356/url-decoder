import { QueryString } from '../QueryString';

const data = {
  a: 1,
  b: '1',
  c: true,
  d: {
    a: false,
  },
};

const str = '%7B%22a%22%3A1%2C%22b%22%3A%221%22%2C%22c%22%3Atrue%2C%22d%22%3A%7B%22a%22%3Afalse%7D%7D';

describe('Util: QueryString', () => {
  it('parse', () => {
    expect(QueryString.parse(str)).toStrictEqual(data);
  });

  it('stringify', () => {
    expect(QueryString.stringify(data)).toBe(str);
  });
});
