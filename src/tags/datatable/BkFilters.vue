<template>
  <div class="q-pa-md bg-secondary filters">
    <div class="filter-form">
      <q-form class="search-header row q-col-gutter-sm items-end" @submit.prevent>
        <div class="col-12 col-md-4">
          <q-input outlined dense model-value="" placeholder="Select a Town" />
        </div>
        <div class="col-12 col-md-2">
          <q-select outlined dense emit-value map-options model-value="all" :options="statusOptions" />
        </div>
        <div class="col-12 col-md-2">
          <q-select outlined dense emit-value map-options model-value="all" :options="buyOptions" />
        </div>
        <div class="col-12 col-md-2">
          <q-select outlined dense emit-value map-options model-value="all" :options="typeOptions" />
        </div>
        <div class="col-12 col-md-1">
          <q-input outlined dense model-value="" placeholder="Price" />
        </div>
        <div class="col-12 col-md-1">
          <q-input outlined dense model-value="" placeholder="ImmoBe Ref" />
        </div>
        <div class="col-12">
          <q-btn color="primary" label="Search" type="submit" />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BkFilters',
  data() {
    return {
      statusOptions: [
        { label: 'Status', value: 'all' },
        { label: 'Draft', value: 'Draft' },
        { label: 'Published', value: 'Published' }
      ],
      buyOptions: [
        { label: 'Buy or Rent', value: 'all' },
        { label: 'Buy', value: 'Buy' },
        { label: 'Rent', value: 'Rent' }
      ],
      typeOptions: [
        { label: 'Type', value: 'all' },
        { label: 'House', value: 'House' },
        { label: 'Apartment', value: 'Apartment' },
        { label: 'Bungalow', value: 'Bungalow' }
      ]
    }
  }
}
</script>

<style scoped>
.filters {
  margin-bottom: 10px;
}

.filter-form {
  max-width: 1100px;
  margin: 0 auto;
}
</style>