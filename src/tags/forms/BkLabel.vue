<template>
  <label :class="computedClass">
    <t :options="context" :locale="locale">{{ label }}</t>
    <QIcon name="fas fa-check" />
  </label>
</template>

<script>
import { Class } from '../../bridge/context'
import BkTranslate from '../translation/BkTranslate.vue'
import { QIcon } from 'quasar'

export default {
  name: 'BkLabel',
  components: {
    QIcon,
    t: BkTranslate
  },
  props: {
    model: {
      type: Class || Object,
      validator(value) {
        if (!Class) return true
        return value instanceof Class
      }
    },
    field: String,
    for: String,
    noLabel: Boolean,
    noRequired: Boolean,
    locale: String
  },
  //inject: ["formModel"],
  computed: {
    computedClass() {
      if (this.noLabel) return 'sr-only'
      return this.ui.labelClass
    },
    label() {
      return this.model?.constructor?.getLabelKey?.(this.field)
    },
    context() {
      let value = {}
      let labelContext = this.$attrs['label-context']
      if (labelContext === undefined) return
      if (labelContext.name && labelContext.value) {
        value[labelContext.name] = labelContext.value
        return value
      }
      return
    },
    definition() {
      return this.model?.getDefinition?.(this.field)
    },
    ui() {
      return this.definition?.ui || {}
    },
    required() {
      if (this.noRequired) return false
      if (this.$props.for === 'view') return false
      let optional
      if (typeof this.definition?.optional === 'function')
        optional = this.definition.optional(this.model, this.formModel)
      else
        optional = this.definition?.optional
      return !optional
    }
  }
}
</script>
