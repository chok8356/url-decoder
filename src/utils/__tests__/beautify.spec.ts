import { beautify } from '../beautify';

const data = '{a: 1, b:{c: true}}';

describe('Utils: beautify', () => {
  it('render', () => {
    expect(beautify(data)).toMatchSnapshot();
  });
});
