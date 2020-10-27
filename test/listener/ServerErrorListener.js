/**
 * @desc    服务器异常监听器 ServerErrorListener.js
 * @author  yijie
 * @date    2020-10-26 20:20
 * @logs[0] 2020-10-26 20:20 yijie 创建了ServerErrorListener.js文件
 */
import {
  ErrorListener,
  ErrorsHandler
} from '~/lib/common/Handler'
import ValueNotDeliveredError from '~/lib/error/ValueNotDeliveredError'

/**
 * 多例模式，每一个异常处理都是独立的
 * 服务器异常处理
 */
class ServerErrorListener extends ErrorListener {
  isLogStack = process.env.NODE_ENV === 'development'

  @ErrorsHandler([ Error ], 1)
  dealError ([ ctx, error ]) {
    console.log('dealError', error)
  }

  @ErrorsHandler([ ValueNotDeliveredError ], 10)
  dealValueNotDeliveredError ([ ctx, error ]) {
    console.log('dealValueNotDeliveredError', error)
  }
}
