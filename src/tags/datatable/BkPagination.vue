<template>
  <div v-if="datatable.getCount() === 0" class="text-center">
    <p><t>app.noData</t></p>
  </div>
  <div v-else>
    <div v-if="scroll">
      <div v-if="viewScrollButton" class="text-center">
        <div v-if="datatable.handler?.ready?.()">
          <q-btn ref="seeMoreLink" color="primary" @click="seeMore">
            <t>app.seeMore</t>
          </q-btn>
        </div>
        <slot v-else name="loading-bottom" v-bind="{ datatable, scroll, perPage }">
          <bk-loading/>
        </slot>
      </div>
    </div>
    <div v-else class="q-mt-sm q-mb-sm flex justify-center">
      <q-pagination
        :model-value="datatable.page"
        :max="pages"
        max-pages="8"
        boundary-numbers
        @update:model-value="paginate"
      />
    </div>
  </div>
</template>

<script>
/**
 * This component allows to create a pagination in the datatable
 * used only in the datatable component
 * ex: <bk-pagination :datatable="datatable" :scroll="scroll" :perPage="perPage" :updateRoute="updateRoute" :count="count"/>
 */
import { QBtn, QPagination } from 'quasar'

export default {
  name: 'BkPagination',
  components: { QBtn, QPagination },
  props: {
    // Datatable object (init from datatable.js). can be find in `'%root%/lib/classes'`
    datatable: {
      type: Object,
      required: true
    },
    // number of record per page
    perPage: {
      type: Number,
      required: true
    },
    // When set to true, no page number but just a button below to load more data
    scroll: {
      type: Boolean
    },
    // When set to true, will update the page number in the Route
    updateRoute: {
      type: Boolean
    },
    // Total number of records even those not yet loaded
    count: {
      type: Number,
      required: true
    }
  },
  data() {
    return { observer: null }
  },
  computed: {
    // @vuese
    // Compute the total count by calling the datatable getCount function
    total() {
      if (!isNaN(this.count)) return this.count
      return this.datatable.getCount()
    },
    pages() {
      if (!this.perPage || this.perPage <= 0) return 1
      const value = Math.ceil(this.total / this.perPage)
      return value > 0 ? value : 1
    },
    // @vuese
    // check if the scroll button needs to be showed
    viewScrollButton() {
      return this.datatable.getCount() > this.datatable.getCountLocal()
    }
  },
  mounted() {
    // set up an IntersectionObserver to detect visibility of the "see more" link
    const el = this.$refs.seeMoreLink?.$el || this.$refs.seeMoreLink
    if (el && typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) this.seeMore()
        })
      }, { threshold: 0.5 })
      this.observer.observe(el)
    }
  },
  unmounted() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  },
  methods: {
    // @vuese
    // set a new page in case of scroll
    seeMore() {
      const page = this.datatable.page
      this.datatable.setPage(page + 1)
    },
    // @vuese
    // set a new page in case of pagination
    paginate(page) {
      this.datatable.setPage(page)
      this.$emit('page-click', page)
    }
  }
}
</script>

<style scoped>
</style>