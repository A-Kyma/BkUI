<template>
  <span v-if="readonly && !isArray && !options" class="mr-1 ml-1">
    <q-badge :color="value" class="q-pa-xs">
      <slot name="default">
        &nbsp;&nbsp;&nbsp;
      </slot>
    </q-badge>
    <slot name="after"/>
  </span>
  <div v-else-if="readonly && options" class="bk-plaintext">
    <q-badge
        v-for="item in options"
        :key="item._id || item.value"
        :color="item.variant || item.value"
        class="q-pa-xs q-mr-xs"
    >
      <slot name="default" v-bind="{item}">
        &nbsp;&nbsp;&nbsp;
      </slot>
    </q-badge>
    <slot name="after"/>
  </div>
  <div v-else-if="readonly && isArray && !options" class="bk-plaintext">
    <q-badge v-for="variant in value" :key="variant" :color="variant" class="q-pa-xs q-mr-xs">
      <slot name="default">
        &nbsp;&nbsp;&nbsp;
      </slot>
    </q-badge>
    <slot name="after"/>
  </div>
  <div v-else class="bk-plaintext">
    <q-badge
        v-for="(item,index) in options"
        :key="item.value"
        :class="'q-ml-xs q-mr-xs cursor-pointer ' + getClass(item.value)"
        :color="item.value"
        @click="onClick(item)"
    >
      <slot name="default">
        {{(index+1).toLocaleString('en', {minimumIntegerDigits: options.length.toString().length})}}
      </slot>
    </q-badge>
  </div>
</template>

<script>
import { Class } from '../../bridge/context'

export default {
  name: 'BkActionableBadges',
  props: {
    model: {
      type: Class || Object,
      validator(value) {
        if (!Class) return true
        return value instanceof Class
      }
    },
    field: String,
    options: {
      type: Array,
      default() {
        return []
      }
    },
    for: String,
    disabled: Boolean,
    state: Boolean,
    value: [String, Array]
  },
  computed: {
    readonly() {
      return this.$props['for'] === "view" || this.disabled
    },
    isArray() {
      return Array.isArray(this.value)
    }
  },
  methods: {
    getClass(itemValue) {
      if (this.isArray && this.value.includes(itemValue))
        return 'checked'
      if (itemValue === this.value)
        return 'checked'
      return ''
    },
    onClick(item) {
      this.$emit('input', item.value)
      this.model[this.field] = item.value
    }
  }
}
</script>

<style scoped>
.bk-plaintext {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: 1.5rem;
}

.checked {
  box-shadow: inset 0 0 0 2px rgb(255 255 255 / 70%);
}
</style>