<template>
  <span @click.meta.exact.capture="showKey">{{ translation }}</span>
</template>

<script setup>
import { computed, inject, ref, useSlots } from 'vue'
import { BKUI_SYMBOL } from '../../index'
import { Class, I18n, Role, autorun, isClient, toast } from '../../bridge/context'

defineOptions({ name: 't' })

const props = defineProps({
  model: [Object, String],
  field: String,
  options: {
    type: Object,
    default: () => ({})
  },
  locale: String
})

const slots = useSlots()
const deps = inject(BKUI_SYMBOL, {})

const getKeyFromSlot = () => {
  const defaultSlot = slots.default?.()
  if (defaultSlot && defaultSlot.length > 0) {
    const firstChild = defaultSlot[0]
    if (firstChild.children && typeof firstChild.children === 'string') {
      return firstChild.children.trim()
    }
    if (firstChild.type === Symbol.for('v-txt')) {
      return String(firstChild.children || '').trim()
    }
  }
  return ''
}

const key = computed(() => {
  const C = deps?.Class || Class
  if (props.model && props.field && C) {
    if (typeof props.model === 'string') {
      return C.get(props.model).getLabelKey(props.field)
    }
    return props.model.constructor.getLabelKey(props.field)
  }
  return getKeyFromSlot()
})

const translationRef = ref('')

const computeTranslation = () => {
  const i18n = deps?.I18n || I18n
  if (!i18n || !key.value) return ''
  const options = { ...props.options }
  if (props.locale) options.locale = props.locale
  return i18n.t(key.value, options)
}

const runAutorun = deps?.autorun || autorun

if (typeof runAutorun === 'function') {
  runAutorun(() => {
    translationRef.value = computeTranslation()
  })
  translationRef.value = computeTranslation()
} else {
  translationRef.value = computeTranslation()
}

const translation = computed(() => translationRef.value)

const showKey = (e) => {
  if (!isClient()) return
  e.preventDefault()
  const role = deps?.Role || Role
  const i18n = deps?.I18n || I18n
  if (!role || !role.is?.('SuperAdministrator')) return
  if (!i18n) return

  const locale = i18n.getLanguage()
  const translationKey = key.value

  let t = i18n.findOne({ locale, key: translationKey })
  if (!t) {
    t = new i18n({ locale, key: translationKey, text: translation.value })
  }
  if (t.text.includes('.')) {
    t.text = ''
  }

  const toastInstance = deps?.toast?.() || toast?.()
  toastInstance?.toast?.({
    title: 'Translation',
    body: () => `<bk-form :model=\"model\" :toast=\"true\"></bk-form>`
  })
}
</script>
