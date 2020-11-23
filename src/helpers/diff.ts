const Diff = require('diff')
import { checkProperty } from '@/helpers/utils'


// See {@link https://github.com/ace-diff/ace-diff/blob/master/src/index.js}
export const DIFF = {
  getLineLengths(editor: any) {
    const lines = editor.session.doc.getAllLines()
    const lineLengths: any[] = []
    lines.forEach((line: any) => {
      lineLengths.push(line.length + 1)
    })
    return lineLengths
  },

  getCharsOnLine(editor: any, line: number) {
    return editor.session.doc.getLine(line).length
  },

  getSingleDiffInfo(editor: any, offset: number, diffString: string) {
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

    const lineLengths = this.getLineLengths(editor)

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

    if (info.startChar > 0 && this.getCharsOnLine(editor, info.startLine) === info.startChar) {
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
    const diff = Diff.diffChars(value1, value2)

    const markers: any = {
      left: {
        added: false,
        data: []
      },
      right: {
        added: true,
        data: []
      }
    }

    const offset = {
      left: 0,
      right: 0
    }

    for (const part of diff) {
      if (!checkProperty(part, 'added') && !checkProperty(part, 'removed')) {
        offset.left += part.count
        offset.right += part.count
      } else if (part.added === true) {
        const marker = this.getSingleDiffInfo(editors.right, offset.right, part.value)
        markers.right.data.push(marker)
        offset.right += part.count
      } else if (part.removed === true) {
        const marker = this.getSingleDiffInfo(editors.left, offset.left, part.value)
        markers.left.data.push(marker)
        offset.left += part.count
      }
    }

    return markers
  }
}