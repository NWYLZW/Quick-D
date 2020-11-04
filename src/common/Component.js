/**
 * @desc    组件库 Component.js
 * @author  yijie
 * @date    2020-11-03 22:00
 * @logs[0] 2020-11-03 22:00 yijie 创建了Component.js文件
 */
import deepDefine from '~/lib/tool/deepDefine'

const getComponentInstance = async (componentName: String) => {
  const autoWiringComponents = deepDefine(global, [{
    name: '$Quick-D',
    default: {}
  }, {
    name: 'autoWiringComponents',
    default: {}
  }])

  let waitTimes = 10
  const getComponent = async (componentName) => {
    const autoWiringComponent = autoWiringComponents[componentName]

    if (autoWiringComponent === undefined || autoWiringComponent.status === 'wiring') {
      return new Promise((resolve, reject) => {
        setTimeout(_ => {
          if (waitTimes === 0) {
            reject(new Error('Component not found'))
            return
          }
          waitTimes-=1

          getComponent(componentName)
            .then(resolve)
            .catch(reject)
        }, 500)
      })
    }

    if (autoWiringComponent.status === 'wired') {
      return autoWiringComponents[componentName]
    } else {
      throw new Error('Unknown Wiring status')
    }
  }
  const Component = (await getComponent(
    componentName.toLowerCase()
  )).value
  return new Component()
}

const QComponent = (componentName: String): ClassDecorator => {
  return (originClass: Function): Function | void => {
    const autoWiringComponents = deepDefine(global, [{
      name: '$Quick-D',
      default: {}
    }, {
      name: 'autoWiringComponents',
      default: {}
    }])

    componentName = (componentName ?? originClass.name).toLowerCase()
    autoWiringComponents[componentName] = {
      status: 'wiring'
    }
    autoWiringComponents[componentName].value = originClass
    autoWiringComponents[componentName].status = 'wired'
  }
}

const QService = QComponent
const QModel = QComponent

const AutoWired = (componentName: String): PropertyDecorator => {
  return (originClass: Object, propertyKey: String | Symbol): void => {
    deepDefine(global, [{
      name: '$Quick-D',
      default: {}
    }, {
      name: 'components',
      default: {}
    }])
    getComponentInstance(componentName ?? propertyKey)
      .then(component => {
        Object.assign(originClass.prototype, {
          [propertyKey]: component
        })
        originClass[propertyKey] = component
      })
  }
}

export {
  QService, QModel, QComponent,
  AutoWired
}
