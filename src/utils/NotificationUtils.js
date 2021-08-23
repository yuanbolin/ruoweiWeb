import { notification } from 'antd'
import { createHashHistory } from 'history'

export const successAndGoBack = info => {
  const key = 'key'
  notification.success({
    key,
    message: info
  })
  createHashHistory().goBack()
}

export const success = info => {
  notification.success({
    message: info
  })
}

export const error = info => {
  notification.error({
    message: info
  })
}

export const warn = info => {
  notification.warning({
    message: info
  })
}
