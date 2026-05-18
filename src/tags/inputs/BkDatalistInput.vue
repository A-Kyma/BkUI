<template>
  <div>
    <q-input
      v-bind="$attrs"
      v-model="inputValue"
      :list="datalistId"
      outlined
      dense
    />
    <datalist :id="datalistId">
      <option v-for="option in datalistOptions" :key="option" :value="option" />
    </datalist>
  </div>
</template>

<script>
import { Class } from '../../bridge/context'

export default {
  name: 'BkDatalistInput',
  props: {
    model: Class,
    options: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      value: this.model?.defaultName?.() || ''
    }
  },
  computed: {
    datalistOptions() {
      return this.options.map((option) => {
        if (typeof option === 'string') return option
        if (option?.text) return option.text
        if (option?.label) return option.label
        return String(option?.value ?? '')
      }).filter(Boolean)
    },

    inputValue: {
      set(value) {
        this.value = value
        this.$emit('input', value)
      },
      get() {
        return this.value
      }
    },
    datalistId() {
      return 'datalist_' + (this.model?._id || 'new')
    }
  }
}
</script>

<style scoped>

</style>