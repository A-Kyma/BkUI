<template>
  <q-btn-dropdown :label="dropdownText" color="primary" outline>
    <q-list>
      <q-item
        v-for="item in options"
        :key="item.value"
        clickable
        v-close-popup
        @click="onClick(item)"
      >
        <q-item-section>{{ item.text }}</q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
import { Class } from '../../bridge/context'
import { QBtnDropdown, QList, QItem, QItemSection } from 'quasar'

export default {
  name: 'BkDropdown',
  components: { QBtnDropdown, QList, QItem, QItemSection },
  props: {
    model: Class,
    field: String,
    options: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    dropdownText() {
      const value = this.model?.[this.field]
      if (value) {
        const translatedElem = this.options.find((elem) => elem.value === value)
        if (translatedElem) return translatedElem.text
      }
      return 'Choose'
    }
  },
  methods: {
    onClick(item) {
      if (!this.model || !this.field || !item) return
      this.model[this.field] = item.value
    }
  }
}
</script>

<style scoped>

</style>