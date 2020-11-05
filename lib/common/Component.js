"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AutoWired = exports.QComponent = exports.QModel = exports.QService = void 0;

var _deepDefine = _interopRequireDefault(require("~/lib/tool/deepDefine"));

/**
 * @desc    组件库 Component.js
 * @author  yijie
 * @date    2020-11-03 22:00
 * @logs[0] 2020-11-03 22:00 yijie 创建了Component.js文件
 */
const getComponentInstance = async componentName => {
  const autoWiringComponents = (0, _deepDefine.default)(global, [{
    name: '$Quick-D',
    default: {}
  }, {
    name: 'autoWiringComponents',
    default: {}
  }]);
  let waitTimes = 10;

  const getComponent = async componentName => {
    const autoWiringComponent = autoWiringComponents[componentName];

    if (autoWiringComponent === undefined || autoWiringComponent.status === 'wiring') {
      return new Promise((resolve, reject) => {
        setTimeout(_ => {
          if (waitTimes === 0) {
            reject(new Error('Component not found'));
            return;
          }

          waitTimes -= 1;
          getComponent(componentName).then(resolve).catch(reject);
        }, 500);
      });
    }

    if (autoWiringComponent.status === 'wired') {
      return autoWiringComponents[componentName];
    } else {
      throw new Error('Unknown Wiring status');
    }
  };

  const Component = (await getComponent(componentName.toLowerCase())).value;
  return new Component();
};

const QComponent = componentName => {
  return originClass => {
    var _componentName;

    const autoWiringComponents = (0, _deepDefine.default)(global, [{
      name: '$Quick-D',
      default: {}
    }, {
      name: 'autoWiringComponents',
      default: {}
    }]);
    componentName = ((_componentName = componentName) !== null && _componentName !== void 0 ? _componentName : originClass.name).toLowerCase();
    autoWiringComponents[componentName] = {
      status: 'wiring'
    };
    autoWiringComponents[componentName].value = originClass;
    autoWiringComponents[componentName].status = 'wired';
  };
};

exports.QComponent = QComponent;
const QService = QComponent;
exports.QService = QService;
const QModel = QComponent;
exports.QModel = QModel;

const AutoWired = componentName => {
  return (originClass, propertyKey) => {
    (0, _deepDefine.default)(global, [{
      name: '$Quick-D',
      default: {}
    }, {
      name: 'components',
      default: {}
    }]);
    getComponentInstance(componentName !== null && componentName !== void 0 ? componentName : propertyKey).then(component => {
      Object.assign(originClass.prototype, {
        [propertyKey]: component
      });
      originClass[propertyKey] = component;
    });
  };
};

exports.AutoWired = AutoWired;