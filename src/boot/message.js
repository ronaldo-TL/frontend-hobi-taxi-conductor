import { boot } from 'quasar/wrappers'
import { Notify } from 'quasar'

const message = {
  success: (message) => {
    Notify.create({
      color: 'positive',
      message,
      icon: 'check_circle',
      position: 'top',
      classes: 'q-px-md q-py-xs text-weight-bold positive_border',
      actions: [
        {
          textColor: 'white',
          icon: 'close',
          round: true
        }
      ]
    })
  },
  error: (message) => {
    Notify.create({
      color: 'negative',
      message,
      icon: 'error',
      position: 'top',
      classes: 'q-px-md q-py-xs text-weight-bold negative_border',
      actions: [
        {
          textColor: 'white',
          icon: 'close',
          round: true
        }
      ]
    })
  },
  warning: (message) => {
    Notify.create({
      color: 'warning',
      message,
      icon: 'report_problem',
      position: 'top',
      classes: 'q-px-md q-py-xs text-weight-bold warning_border',
      actions: [
        {
          textColor: 'white',
          icon: 'close',
          round: true
        }
      ]
    })
  },
  info: (message) => {
    Notify.create({
      color: 'info',
      message,
      icon: 'report_problem',
      position: 'top',
      classes: 'q-px-md q-py-xs text-weight-bold info_border',
      actions: [
        {
          textColor: 'white',
          icon: 'close',
          round: true
        }
      ]
    })
  }
}

export default boot(({ app }) => {
  app.config.globalProperties.$message = message
  app.provide('message', message)
})

export { message }
