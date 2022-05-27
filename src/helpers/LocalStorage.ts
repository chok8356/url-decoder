const PREFIX = 'UD@';

function getPrefix(key: string) {
  return PREFIX + key;
}

export class LocalStorage {
  static get(key: string) {
    const data = localStorage.getItem(getPrefix(key));
    return data ? JSON.parse(data) : undefined;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  static put(key: string, value: any) {
    localStorage.setItem(getPrefix(key), JSON.stringify(value));
    return true;
  }

  static delete(key: string) {
    localStorage.removeItem(getPrefix(key));
  }
}
