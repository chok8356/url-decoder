const Diff = require('diff')
import { checkProperty } from '@/helpers/utils'
import { EMPTY_MARKERS } from '@/helpers/contants'

// See {@link https://github.com/ace-diff/ace-diff/blob/master/src/index.js}
export const DIFF = {
  getSingleDiffInfo(editor: any, offset: number, diffString: string) {
    console.log(editor, editor.getSession())
    if (!editor) return
    const info = {
      startLine: 0,
      startChar: 0,
      endLine: 0,
      endChar: 0
    }
    const endCharNum = offset + diffString.length
    let runningTotal = 0
    let startLineSet = false
    let endLineSet = false
    const lines = editor.getSession().doc.getAllLines()
    const lineLengths: any[] = []
    lines.forEach((line: any) => {
      lineLengths.push(line.length + 1)
    })
    lineLengths.forEach((lineLength: number, lineIndex: number) => {
      runningTotal += lineLength
      if (!startLineSet && offset < runningTotal) {
        info.startLine = lineIndex
        info.startChar = offset - runningTotal + lineLength
        startLineSet = true
      }
      if (!endLineSet && endCharNum <= runningTotal) {
        info.endLine = lineIndex
        info.endChar = endCharNum - runningTotal + lineLength
        endLineSet = true
      }
    })
    if (info.startChar > 0 && editor.getSession().doc.getLine(info.startLine).length === info.startChar) {
      info.startLine++
      info.startChar = 0
    }
    if (info.endChar === 0) {
      info.endLine--
    }
    const endsWithNewline = /\n$/.test(diffString)
    if (info.startChar > 0 && endsWithNewline) {
      info.endLine++
    }
    return info
  },

  getDiff(editors: any, value1: string, value2: string) {
    if (!value1 || !value2) return []
    if (!editors.left || !editors.right) return []
    const diff = Diff.diffLines(value1, value2)
    const markers: any = EMPTY_MARKERS
    const offset = {
      left: 0,
      right: 0
    }
    for (const part of diff) {
      let partLength = part.value.length
      if (!checkProperty(part, 'added') && !checkProperty(part, 'removed')) {
        offset.left += partLength
        offset.right += partLength
      } else if (part.added === true) {
        markers.right.data.push(
          this.getSingleDiffInfo(editors.right, offset.right, part.value)
        )
        offset.right += partLength
      } else if (part.removed === true) {
        markers.left.data.push(
          this.getSingleDiffInfo(editors.left, offset.left, part.value)
        )
        offset.left += partLength
      }
    }
    return markers
  }
}