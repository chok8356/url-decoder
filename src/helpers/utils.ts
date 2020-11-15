export function decode(str: string) {
  if (!str) return ''
  return decodeURIComponent(str)
}

export function getUrlVars(url: string) {
  let hash
  const result: any = {}
  const hashes = url.slice(url.indexOf('?') + 1).split('&')
  for (let i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=')
    result[hash[0]] = hash[1]
  }
  return result
}

export function parse(str: string) {
  let json: any = {}
  let error = null
  try {
    json = JSON.parse(str)
    if (json && Object.keys(json)?.length) {
      for (const key in json) {
        const data = json[key]
        if (data) {
          const { json: obj, error } = parse(data)
          if (!error) json[key] = obj
        }
      }
    }
  } catch (err) {
    error = err
  }

  return {
    json,
    error
  }
}

export function stringify(json: any) {
  let str = ''
  let error = null

  try {
    str = JSON.stringify(json, undefined, 2)
  } catch (err) {
    error = err
  }

  if (!str) {
    return {
      json,
      error
    }
  }

  return {
    str,
    error
  }
}

export function formatting(text: string = '') {
  let error = null
  const stringifyText = JSON.stringify(getUrlVars(decode(text)))
  const { json, error: parseError } = parse(stringifyText)

  if (parseError) {
    return {
      value: text,
      error: parseError
    }
  }

  if (!json || !Object.keys(json)?.length) {
    return {
      value: text,
      error
    }
  }

  const { str: newText, error: stringifyError } = stringify(json)

  if (stringifyError) {
    return {
      value: text,
      error: stringifyError
    }
  }

  if (!newText) {
    return {
      value: text,
      error
    }
  }

  return {
    value: newText,
    error
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
