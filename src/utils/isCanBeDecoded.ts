export const isCanBeDecoded = (uri: string) => {
  if (!uri) return '';
  try {
    return uri !== decodeURIComponent(uri);
  } catch (error) {
    return false;
  }
};
