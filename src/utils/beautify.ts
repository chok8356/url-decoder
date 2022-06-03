import jsBeautify from 'js-beautify';

export const beautify = (str: string) => {
  return jsBeautify(str, { indent_size: 2 });
};
