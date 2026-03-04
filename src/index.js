import BkTranslate from './tags/translation/BkTranslate.vue'
import BkLabel from './tags/forms/BkLabel.vue'
import { setBkUIContext, Bk, Class, I18n, Role, autorun, isClient, toast } from './bridge/context'

const BKUI_SYMBOL = Symbol('bkui')

const createBkUI = (options = {}) => {
  const defaults = {
    Bk: null,
    Class: null,
    I18n: null,
    Role: null,
    autorun: null,
    isClient: null,
    toast: null
  }
  return { ...defaults, ...options }
}

const BkUI = {
  install(app, options = {}) {
    const deps = createBkUI(options)
    setBkUIContext(deps)
    app.provide(BKUI_SYMBOL, deps)

    app.component('BkTranslate', BkTranslate)
    app.component('BkLabel', BkLabel)

    // Backward-compatible alias
    app.component('t', BkTranslate)
  }
}

export { BkUI, BkTranslate, BkLabel, BKUI_SYMBOL }
export { Bk, Class, I18n, Role, autorun, isClient, toast }
export default BkUI
