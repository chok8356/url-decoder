export class QueryString {
  static parse(query) {
    return JSON.parse(decodeURIComponent(query));
  }

  static stringify(object) {
    return encodeURIComponent(JSON.stringify(object));
  }
}
