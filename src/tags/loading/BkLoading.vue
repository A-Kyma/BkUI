<template>
  <div v-if="type === 'dots'" class="text-center">
    <q-spinner-dots :size="size" :color="color" />
  </div>
  <div v-else-if="type === 'loading'">
    <div class="text-center">LOADING</div>
    <div class="text-center">
      <q-spinner-dots color="dark" size="1.2em" class="q-mr-sm" />
      <q-spinner-dots color="warning" size="1.2em" class="q-mr-sm" />
      <q-spinner-dots color="negative" size="1.2em" />
    </div>
  </div>
  <div v-else class="text-center">
    <q-spinner color="primary" :size="size" />
  </div>
</template>

<script>
export default {
  name: 'BkLoading',
  props: {
    type: String,
    variant: String,
    fontScale: {
      type: String,
      default: '4'
    }
  },
  computed: {
    size() {
      const value = Number(this.fontScale)
      if (!Number.isFinite(value) || value <= 0) return '2em'
      return value + 'em'
    },
    color() {
      return this.variant || 'primary'
    }
  }
}
</script>

<style scoped>
</style>