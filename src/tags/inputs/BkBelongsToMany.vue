<template>
  <div
    v-if="!plaintext && $props['for'] !== 'view' && ui.template === 'BFormRadioGroup'"
    class="q-gutter-md"
  >
    <q-radio
      v-for="item in options || relationList"
      :key="item.value"
      :model-value="getId"
      :val="item.value"
      :disable="plaintext"
      :label="item.text"
      @update:model-value="onSelectValueUpdate"
    />
  </div>
  <div v-else-if="!plaintext && $props['for'] !== 'view'" :class="'q-gutter-md ' + classSingleOrTag">
    <q-select
      ref="select"
      class="full-width"
      v-bind="$attrs"
      :model-value="getId"
      @update:model-value="onSelectValueUpdate"
      :options="options || relationList"
      option-label="text"
      option-value="value"
      emit-value
      map-options
      :multiple="isArray"
      :use-chips="isArray"
      :hide-selected="isArray"
      :disabled="disabledData"
      :placeholder="placeholder"
      :loading="!ready"
      :clearable="!disabledData"
      :use-input="searchableData"
      input-debounce="150"
      :max-values="maxTags"
      :new-value-mode="isArray ? 'add-unique' : 'add'"
      @new-value="onTagValue"
      @filter="onFilter"
      @popup-show="onOpenDropdown"
      @popup-hide="onCloseDropdown"
      @clear="onRemoveAllTags"
    >
      <template #option="scope">
        <slot
          :name="formFieldComputed + '-option'"
          v-bind="{ option: scope.opt, selected: scope.selected, itemProps: scope.itemProps }"
        >
          <q-item v-bind="scope.itemProps">
            <q-item-section>{{ scope.opt?.text }}</q-item-section>
          </q-item>
        </slot>
      </template>

      <template #selected-item="scope">
        <slot
          v-if="isArray"
          :name="formFieldComputed + '-tag'"
          v-bind="{ option: scope.opt, index: scope.index, removeAtIndex: scope.removeAtIndex }"
        >
          <q-chip
            dense
            removable
            @remove="scope.removeAtIndex(scope.index)"
          >
            {{ scope.opt?.text }}
          </q-chip>
        </slot>
        <slot
          v-else
          :name="formFieldComputed + '-single'"
          v-bind="{ option: scope.opt }"
        >
          <span>{{ scope.opt?.text }}</span>
        </slot>
      </template>

      <template #no-option>
        <slot :name="formFieldComputed + '-noResult'">
          <q-item>
            <q-item-section class="text-grey">
              <t v-if="filterQuery">app.notFound</t>
              <t v-else>app.noData</t>
            </q-item-section>
          </q-item>
        </slot>
      </template>
    </q-select>

    <div v-if="isArray && maxTags && Array.isArray(getId) && getId.length >= maxTags" class="text-caption text-grey-7 q-mt-xs">
      <t :options="{'count': maxTags}">app.maxTags</t>
    </div>

    <div class="multiselect-append">
      <q-btn
          v-if="searchableComputed && selectInput && !disabledData"
          size="sm"
          @click.prevent="allowSearch"
          color="dark"
          flat
          icon="search"
      />

      <slot
          :name="formFieldComputed + '-append'"
          v-bind="{...$props, ...{oldValue, value: getId}}"
      />
    </div>
    <slot :name="formFieldComputed+'-after'"
          v-bind="{...$props, oldValue, value: getId, options: relationList, ready, removeId, removeAll}"
    />
  </div>
  <span v-else class="bk-plaintext">
    {{viewInputRelation}}
  </span>

</template>

<script>
import { Class, I18n } from '../../bridge/context'
import relationSubscriptionMixin from '../../utils/relationSubscriptionMixin'

export default {
  name: "BkBelongsToMany",
  mixins: [relationSubscriptionMixin],
  props: {
    taggable: {
      type: Boolean,
      default: true,
    },
    maxTags: {
        type: Number,
    },
    searchable: {
      type: Boolean,
      default: undefined
    },
    limit: Number,
    formField: String,
  },
  data() {
    return {
      searchableData: undefined,
      disabledData: this.disabled,
      filterQuery: ''
    }
  },
  computed: {
    searchableComputed() {
      if (!this.selectInput) return true // if it's an autocomplete tag
      if (this.searchable !== undefined) return this.searchable // forced by upper tag
      if (this.definition.searchable !== undefined) return this.definition.searchable // forced by definition
      return true
    },
    formFieldComputed() {
      return this.formField || this.field;
    },
    classSingleOrTag() {
      if (!this.isArray) return "bk-multiselect--single"
      return "bk-multiselect--tag"
    }
  },
  meteor: {
    tagPlaceholder() {
      if (this.definition.searchable)
        return I18n.get("app.clickAdd")
      return I18n.get("app.notFound")
    },
    placeholder() {
      if (this.searchableData || !this.selectInput)
        return I18n.get("app.search")
      else
        return I18n.get("app.select")
    }
  },
  methods: {
    onFilter(query, update) {
      update(() => {
        this.filterQuery = query || ''
        this.search(query)
      })
    }
  },
}
</script>

<style>

.bk-multiselect--tag .q-field,
.bk-multiselect--single .q-field {
  margin-bottom: 0;
}

.bk-multiselect--tag .q-select {
  min-width: 180px;
}

.bk-multiselect--single .q-select {
  min-width: 120px;
}

.multiselect-append {
  display: flex;
  align-items: center;
}

.bk-plaintext {
  min-height: 1.5rem;
}
</style>
