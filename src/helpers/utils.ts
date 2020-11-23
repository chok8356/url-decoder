export function decode(str: string): string {
  if (!str) return ''
  try {
    return decodeURIComponent(str)
  } catch (error) {
    console.error('Decode error', error)
    return str
  }
}

export function getUrlVars(url: string) {
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

export function formatting(data: string) {
  try {
    let text = decode(data)
    if (isValidJson(text)) {
      return text
    }
    const vars = getUrlVars(text)
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

// export function computeDiff() {

// }