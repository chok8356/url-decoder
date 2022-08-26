const token = '%[a-f0-9]{2}';
const singleMatcher = new RegExp(token, 'gi');
const multiMatcher = new RegExp(`(${token})+`, 'gi');

const decodeComponents = (components, split = 1) => {
  try {
    return decodeURIComponent(components.join(''));
  } catch (err) {
    if (components.length === 1) return components;
    const left = components.slice(0, split);
    const right = components.slice(split);
    return [
      ...decodeComponents(left),
      ...decodeComponents(right),
    ];
  }
};

const decodePart = (input) => {
  try {
    return decodeURIComponent(input);
  } catch (err) {
    let result = input;
    let tokens = result.match(singleMatcher);
    for (let i = 1; i < tokens.length; i += 1) {
      result = decodeComponents(tokens, i).join('');
      tokens = result.match(singleMatcher);
    }
    return result;
  }
};

export const customDecodeURIComponent = (input) => {
  const replaceMap = {
    '%FE%FF': '\uFFFD\uFFFD',
    '%FF%FE': '\uFFFD\uFFFD',
  };
  let match = multiMatcher.exec(input);
  while (match) {
    try {
      replaceMap[match[0]] = decodeURIComponent(match[0]);
    } catch (err) {
      const decodedPart = decodePart(match[0]);
      if (decodedPart !== match[0]) replaceMap[match[0]] = decodedPart;
    }
    match = multiMatcher.exec(input);
  }
  replaceMap['%C2'] = '\uFFFD';
  const entries = Object.keys(replaceMap);
  let result = input;
  for (let i = 0; i < entries.length; i += 1) {
    const key = entries[i];
    result = result.replace(new RegExp(key, 'g'), replaceMap[key]);
  }
  return result;
};
