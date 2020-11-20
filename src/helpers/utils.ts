export function decode(str: string) {
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
    result[hash[0]] = hash[1]
  }
  return result
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

export function formatting(text: string) {
  try {
    const stringifyText = JSON.stringify(getUrlVars(decode(text)))
    if (!stringifyText) return text
    const json = parse(stringifyText)
    if (!json || !Object.keys(json)?.length) return text
    const str = stringify(json)
    if (!str) return text
    return str
  } catch (error) {
    console.error('Formatting error', error)
    return text
  }
}

export function getInsertedText(el: HTMLInputElement, text: string ) {
  if(!el) return
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const value = el.value
  if (start === null) return
  if (end === null) return
  return  value.substring(0, start) + text + value.substring(end, value.length);
}

export function IsValidJson(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}
