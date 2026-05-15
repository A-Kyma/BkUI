import { I18n, ValidationError, toast as contextToast } from '../bridge/context'

const translate = (key) => {
  if (!key) return key
  if (I18n?.t) return I18n.t(key)
  if (I18n?.get) return I18n.get(key)
  return key
}

export default {
  methods: {
    notify(opts) {
      if (this?.$q?.notify) {
        this.$q.notify(opts)
        return
      }

      if (typeof contextToast === 'function') {
        contextToast(opts)
      }
    },
    showError(err, model) {
      const activeModel = model || this.model
      if (activeModel?.setError) activeModel.setError(err)

      let message
      const meteorError = activeModel?.getError?.('MeteorError')

      if (meteorError) {
        message = translate(meteorError)
      } else if (ValidationError?.is?.(err)) {
        message = translate('app.Meteor.Error.Validation error')
      } else {
        message = translate('app.Meteor.Error.Unknown error')
      }

      this.notify({
        type: 'negative',
        message,
        caption: translate('app.toast.title.failed')
      })
      this.$emit('error', message, err)
    },
    showMeteorError(err) {
      if (!err || err.errorType !== 'Meteor.Error') return

      const message = translate('app.Meteor.Error.' + err.error)
      this.notify({
        type: 'negative',
        message,
        caption: translate('app.toast.title.failed')
      })
      this.$emit('error', message, err)
    },
    showSuccess(key = 'app.toast.title.success') {
      this.notify({
        type: 'positive',
        message: translate('app.success'),
        caption: translate(key)
      })
    },
    errorCallback(err, result, model) {
      if (err) {
        this.showError(err, model)
      } else {
        this.showSuccess()
        this.$emit('success', result, model)
      }
    }
  }
}