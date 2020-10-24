/**
 * @desc    移除文本中的注释 removeComments.js
 * @author  yijie
 * @date    2020-10-24 16:22
 * @logs[0] 2020-10-24 16:22 yijie 创建了removeComments.js文件
 */

const replaceQuotationMarksWithForwardSlash = (codes: string) => {
  let matchedObj = {}
  let replacedCodes = ''

  let regQuotation = /(?<!\\)('|"|`).*?(?<!\\)\1/mg
  let uniqueStr = 'QUOTATIONMARKS' + Math.floor(Math.random()*10000)

  let index = 0
  replacedCodes = codes.replace(regQuotation, match => {
    let s = uniqueStr + (index++)
    matchedObj[s] = match
    return s
  })

  return { replacedCodes, matchedObj }
}

/**
 * 删除文本中的所有注释
 * @param codes 待移除注释文本内容
 * @returns {string}
 */
export default (codes: string): string => {
  let {replacedCodes, matchedObj} = replaceQuotationMarksWithForwardSlash(codes)

  replacedCodes = replacedCodes.replace(/(\s*(?<!\\)\/\/.*$)|(\s*(?<!\\)\/\*[\s\S]*?(?<!\\)\*\/)/mg, '')
  Object.keys(matchedObj).forEach(k => {
    replacedCodes = replacedCodes.replace(k, matchedObj[k])
  })

  return replacedCodes
}
