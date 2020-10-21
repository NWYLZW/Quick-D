/**
 * @desc    参数装饰器 Param.js
 * @author  yijie
 * @date    2020-10-20 17:53
 * @logs[0] 2020-10-20 17:53 yijie 创建了Param.js文件
 */

const Query = (name, required, ...args) => {
  let [ target, methodName, index ] = [ name, required, ...args ]
  const queryDecorator =  (target: Function , methodName: string, index: number) => {
    let queries = Reflect.getMetadata('queries', target[methodName])
    if (queries === undefined) {
      queries = []
      Reflect.defineMetadata('queries', queries, target[methodName])
    }
    queries.push({
      name, required, index
    })
    Reflect.defineMetadata('queries', queries, target[methodName])
  }
  if (typeof target === 'object') {
    name = undefined
    required = undefined
    queryDecorator(target, methodName, index)
    return
  }
  return queryDecorator
}

export {
  Query
}
