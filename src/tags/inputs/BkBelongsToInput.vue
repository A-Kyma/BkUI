<template>
  <q-select
    ref="select"
    v-bind="$attrs"
    :model-value="getId"
    @update:model-value="onSelectValueUpdate"
    :options="relationList"
    option-label="text"
    option-value="value"
    emit-value
    map-options
    :placeholder="placeholder || defaultPlaceholder"
    :loading="!ready"
    :disabled="disabledData"
    :clearable="!disabledData"
    :use-input="!selectInput || searchableData"
    input-debounce="150"
    :error="state === false"
    :error-message="validationMessage"
    @filter="onFilter"
    @popup-show="onOpenDropdown"
    @popup-hide="onCloseDropdown"
    @clear="onRemoveAllTags"
  >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">
          <t>app.noData</t>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
import _ from 'lodash'
import { I18n } from '../../bridge/context'
import relationSubscriptionMixin from '../../utils/relationSubscriptionMixin'
import { QSelect, QItem, QItemSection } from 'quasar'

export default {
  name: 'BkBelongsToInput',
  components: { QSelect, QItem, QItemSection },
  mixins: [relationSubscriptionMixin],
  props: {
    placeholder: String
  },
  mounted() {
    this.isMounted = true
  },
  unmounted() {
    this.isMounted = false
  },
  data() {
    return {
      isMounted: false
    }
  },
  computed: {
    defaultPlaceholder() {
      if (!this.selectInput || this.searchableData) return I18n.get('app.search')
      return I18n.get('app.select')
    },
    validationMessage() {
      const errors = this.model?.getError?.(this.field)
      if (!errors?.length) return ''
      return errors.map((item) => item.message).join(', ')
    },
    state() {
      const errors = this.model?.getError?.(this.field)
      if (errors?.length) return false
      if (_.isEqual(this.getId, this.oldValue) || !this.isMounted) return null
      return true
    }
  },
  watch: {
    state(value) {
      const errors = this.model?.getError?.(this.field)
      if (errors?.length) {
        this.$emit('validationError', errors.map((item) => item.message).join('<br/>'))
      }
      this.$emit('state', value)
    }
  },
  methods: {
    onFilter(query, update) {
      update(() => {
        this.search(query)
      })
    }
  }
}
</script>

<style scoped>
</style>