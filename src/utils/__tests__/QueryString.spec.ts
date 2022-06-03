import { QueryString } from '../QueryString';

describe('Utils: QueryString', () => {
  describe('canBeDecoded', () => {
    it('true', () => {
      expect(QueryString.canBeDecoded('%7B%20a%3A%201%20%7D')).toBeTruthy();
    });

    it('false', () => {
      expect(QueryString.canBeDecoded('{ a: 1 }')).toBeFalsy();
    });
  });

  it('decode', () => {
    expect(QueryString.decode('%7B%20a%3A%201%20%7D')).toBe('{ a: 1 }');
  });

  it('decodeFull', () => {
    expect(QueryString.decodeFull('%257B%2520a%253A%25201%2520%257D')).toBe('{ a: 1 }');
  });

  it('encode', () => {
    expect(QueryString.encode('{ a: 1 }')).toBe('%7B%20a%3A%201%20%7D');
  });

  it('extractParam', () => {
    expect(QueryString.extractParam('url=%2Fapi%2Fv2%2Fpartners%2Fchildren%2Flist%2F&method=get'))
      .toBe('{"url":"/api/v2/partners/children/list/","method":"get"}');
  });
});
