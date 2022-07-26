export class QueryString {
  static canBeDecoded = (query: string): boolean => {
    return query !== QueryString.decode((query));
  };

  static decode(query: string): string {
    try {
      return decodeURIComponent(query);
    } catch (e) {
      return query;
    }
  }

  static decodeFull(query: string): string {
    const text = QueryString.decode(query);
    if (QueryString.canBeDecoded(text)) {
      return QueryString.decodeFull(text);
    }
    return text;
  }

  static encode(query: string): string {
    try {
      return encodeURIComponent(query);
    } catch (e) {
      return query;
    }
  }

  static extractParam(query: string): string {
    try {
      const result = {};
      const params = new URLSearchParams(query);

      for (const [key, value] of params.entries()) {
        if (key === query) continue;
        try {
          result[key] = JSON.parse(value);
        } catch (e) {
          result[key] = value;
        }
      }

      if (!Object.keys(result).length) return query;

      return JSON.stringify(result);
    } catch (e) {
      return query;
    }
  }
}
