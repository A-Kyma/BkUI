<template>
  <div class="q-mt-sm row q-gutter-sm items-center">
    <q-btn
      v-if="$props['for'] !== 'view' && !excludeButtons.includes('submit')"
      type="submit"
      color="primary"
      outline
    >
      <t :key="submit">{{ submit }}</t>
    </q-btn>

    <q-btn
      v-if="$props['for'] !== 'view' && !toast && !excludeButtons.includes('reset')"
      type="reset"
      color="negative"
      outline
    >
      <t>app.reset</t>
    </q-btn>

    <q-btn
      v-if="!toast && !excludeButtons.includes('cancel')"
      type="button"
      color="grey-7"
      outline
      @click="onCancel"
    >
      <t>app.cancel</t>
    </q-btn>

    <slot name="after-submit"/>
  </div>
</template>

<script>
import { QBtn } from 'quasar'

export default {
  name: 'BkSubmit',
  components: { QBtn },
  props: {
    for: String,
    toast: Boolean,
    excludeButtons: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    submit() {
      if (this.for) {
        return 'app.' + this.for
      }
      return 'app.submit'
    }
  },
  methods: {
    onCancel(e) {
      this.$emit('cancel', e)
    },
  }
}
</script>

<style scoped>

</style>