/**
 * @desc    深度定义 deepDefine.js
 * @author  yijie
 * @date    2020-11-04 10:29
 * @logs[0] 2020-11-04 10:29 yijie 创建了deepDefine.js文件
 */
export default (baseObj, properties) => {
  properties.forEach(property => {
    baseObj[property.name] = baseObj[property.name] ?? property.default
    baseObj = baseObj[property.name]
  })
  return baseObj
}
