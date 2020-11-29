// eslint-disable-next-line @typescript-eslint/no-var-requires
const JsBeautify = require('js-beautify')

export function isEncoded(uri: string) {
  if (!uri) return ''
  try {
    return uri !== decodeURIComponent(uri);
  } catch (error) {
    return false
  }
}

export function decode(str: string): string {
  if (!str) return ''
  try {
    return decodeURIComponent(str);
  } catch (error) {
    console.error('Decode error', error)
    return str
  }
}

export function decodeFull(str: string): string {
  if (!str) return ''
  try {
    if (isEncoded(str)) {
      return decodeFull(decode(str));
    } else {
      return decode(str)
    }
  } catch (error) {
    console.error('decodeFull error', error)
    return str
  }
}


export function encode(str: string): string {
  if (!str) return ''
  try {
    return encodeURIComponent(str)
  } catch (error) {
    console.error('Encode error', error)
    return str
  }
}

export function getUrlParams(url: string) {
  let hash
  const result: any = {}
  const hashes = url.slice(url.indexOf('?') + 1).split('&')
  for (const value of hashes) {
    hash = value.split('=')
    if (hash[0] === url) return {}
    result[hash[0]] = hash[1]
  }
  return result && Object.keys(result)?.length > 0 ? result : {}
}

export function parse(str: string) {
  let json: any = {}
  try {
    json = JSON.parse(str)
    if (json && Object.keys(json)?.length) {
      for (const key in json) {
        const data = json[key]
        if (data) {
          const obj = parse(data)
          json[key] = obj
        }
      }
    }
    return json
  } catch (error) {
    return str
  }
}

export function stringify(json: any) {
  try {
    return JSON.stringify(json, undefined, 2)
  } catch (error) {
    console.error('Stringify error', error)
    return json
  }
}

export function decodeAndFormat(data: string) {
  try {
    let text = decodeFull(data)
    if (isValidJson(text)) {
      return text
    }
    const vars = getUrlParams(text)
    if (vars && Object.keys(vars)?.length) {
      text = stringify(vars)
    }
    text = parse(text)
    if (typeof text === 'object') {
      text = stringify(text)
    }
    return text
  } catch (error) {
    console.error('Formatting error', error)
    return data
  }
}

export function getBeautifyText(text: string) {
  if (!text) return ''
  // eslint-disable-next-line @typescript-eslint/camelcase
  return JsBeautify(text, { indent_size: 2 })
}

export function isValidJson(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export async function wait(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export function checkProperty(obj: any, prop: string) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}