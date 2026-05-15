import { I18n, Meteor, Tracker, Class, ListField } from '../bridge/context'
import errorPopupMixin from './errorPopupMixin'

const isNil = (v) => v === null || v === undefined

export default {
  props: {
    model: {
      type: Class || Object,
      required: true
    },
    field: {
      type: String,
      required: true
    },
    for: String,
    plaintext: Boolean,
    disabled: Boolean,
    single: Boolean,
    method: String,
    options: Array
  },
  inject: ['formModel'],
  mixins: [errorPopupMixin],
  data() {
    return {
      oldValue: null,
      value: undefined,
      handler: undefined,
      ready: true,
      relationList: [],
      searchableData: undefined,
      disabledData: this.disabled,
      isDropdownOpen: false
    }
  },
  created() {
    this.searchableData = !this.selectInput || this.definition?.searchable
    this.oldValue = this.getId

    if (!this.emptyId || this.selectInput) {
      this.activateSubscription(!this.readonly)
    }
  },
  unmounted() {
    if (this.handler?.stop) this.handler.stop()
  },
  computed: {
    definition() {
      return this.model?.getDefinition?.(this.field)
    },
    ui() {
      return this.definition?.ui || {}
    },
    uiComponentProps() {
      if (this.ui?.props && typeof this.ui.props === 'object') return this.ui.props
      return {}
    },
    optional() {
      if (typeof this.definition?.optional === 'function') {
        return this.definition.optional(this.model)
      }
      return this.definition?.optional
    },
    readonly() {
      return this.for === 'view' || this.plaintext || this.disabled
    },
    subscription() {
      return this.definition?.subscription
    },
    meteorMethod() {
      return this.method || this.definition?.method
    },
    isArray() {
      if (this.single) return false
      if (!ListField || !this.definition) return Array.isArray(this.model?.[this.field])
      return this.definition instanceof ListField
    },
    fieldValue() {
      return this.model?.[this.field]
    },
    getId() {
      const definition = this.definition
      if (!definition) return this.fieldValue

      if (this.isArray) {
        if (!Array.isArray(this.fieldValue)) return []
        if (definition.cache) return this.fieldValue.map((x) => x?._id)
        return this.fieldValue
      }

      if (definition.cache && typeof this.fieldValue === 'object') {
        return this.fieldValue?._id
      }
      return this.fieldValue
    },
    emptyId() {
      const id = this.getId
      if (isNil(id)) return true
      if (Array.isArray(id) && id.length === 0) return true
      if (typeof id === 'string' && id.length === 0) return true
      return false
    },
    selectInput() {
      return this.minCharacters === 0 || this.options !== undefined
    },
    minCharacters() {
      const definition = this.definition
      if (!definition) return 3
      let min = definition.minCharacters
      if (typeof min === 'function') {
        min = min({ model: this.model, field: this.field })
      }
      if (isNil(min) || Number.isNaN(Number(min))) return 3
      return Number(min)
    },
    where() {
      if (this.options) return {}

      const definition = this.definition
      if (!definition?.where && this.readonly) {
        const ids = Array.isArray(this.getId) ? this.getId : [this.getId]
        return { search: { _id: { $in: ids.filter(Boolean) } } }
      }

      const locale = I18n?.getLanguage ? I18n.getLanguage() : 'en'
      const where = definition?.where?.call(
        this.model,
        this.getId,
        this.value,
        locale,
        this.formModel
      )
      if (!where) return
      if (!where.search && !where.param) return { search: where }
      return where
    },
    inputValue: {
      set(value) {
        if (value === this.value) return
        this.value = value

        if (typeof value === 'string' && value.length >= this.minCharacters && this.minCharacters !== 0) {
          this.activateSubscription(true)
        }

        if (this.emptyId && typeof value === 'string' && value.length < this.minCharacters) {
          if (this.handler?.stop) this.handler.stop()
          this.relationList = []
        }
      },
      get() {
        return this.value
      }
    },
    inputRelation: {
      set() {
        // Updates are handled through onSelectRow/onRemoveTag.
      },
      get() {
        if (this.emptyId) return undefined

        if (this.options) {
          if (this.isArray) {
            return this.options.filter((e) => this.getId.includes(e.value))
          }
          return this.options.find((e) => this.getId === e.value)
        }

        if (this.isArray) {
          return this.relationList.filter((e) => this.getId.includes(e.value))
        }
        return this.relationList.find((e) => this.getId === e.value)
      }
    },
    viewInputRelation() {
      const relations = this.inputRelation
      if (!relations) return ''
      if (this.isArray) return relations.map((elem) => elem.text).join(', ')
      return relations.text
    }
  },
  watch: {
    getId() {
      if (!this.subscription || this.isArray) return
      this.activateSubscription(!this.readonly)
    },
    where: {
      handler() {
        if (!this.selectInput) return
        this.activateSubscription(!this.readonly)
      },
      deep: true
    }
  },
  methods: {
    findOptionByValue(value) {
      const list = this.options || this.relationList || []
      return list.find((item) => item?.value === value)
    },
    onSelectValueUpdate(nextValue) {
      if (this.isArray) {
        const currentIds = Array.isArray(this.getId) ? this.getId.filter((v) => !isNil(v)) : []
        const nextIds = Array.isArray(nextValue) ? nextValue.filter((v) => !isNil(v)) : []

        const removed = currentIds.filter((id) => !nextIds.includes(id))
        removed.forEach((id) => this.removeId(id))

        const added = nextIds.filter((id) => !currentIds.includes(id))
        added.forEach((id) => {
          const row = this.findOptionByValue(id) || { value: id }
          this.setId(row)
        })

        this.$emit('input', this.model[this.field])
        return
      }

      const currentId = this.getId
      if (isNil(nextValue) || nextValue === '') {
        if (!isNil(currentId)) this.removeId(currentId)
        this.$emit('input', this.model[this.field])
        return
      }

      const row = this.findOptionByValue(nextValue) || { value: nextValue }
      this.setId(row)
      this.$emit('input', this.model[this.field])
    },
    onTagValue(value, done) {
      this.$emit('tag', { model: this.model, field: this.field, value })
      if (typeof done === 'function') done(value)
    },
    setId(row) {
      if (!row) return

      const id = row.value
      const record = row.record
      const definition = this.definition
      if (!definition) return

      if (this.isArray) {
        if (!Array.isArray(this.model[this.field])) this.model[this.field] = []

        if (definition.cache) {
          const exists = this.model[this.field].some((e) => e?._id === record?._id)
          if (!exists && record) this.model[this.field].push(record)
        } else {
          if (!this.model[this.field].includes(id)) this.model[this.field].push(id)
        }
      } else if (definition.cache) {
        this.model[this.field] = record
      } else {
        this.model[this.field] = id
      }

      this.$emit('select', row)
    },
    removeId(id) {
      const definition = this.definition
      if (!definition) return

      if (this.isArray) {
        if (!Array.isArray(this.model[this.field])) return

        if (definition.cache) {
          this.model[this.field] = this.model[this.field].filter((e) => e?._id !== id)
        } else {
          this.model[this.field] = this.model[this.field].filter((e) => e !== id)
        }
        return
      }

      if (definition.cache) {
        if (this.model[this.field]?._id === id) this.model[this.field] = undefined
      } else if (this.model[this.field] === id) {
        this.model[this.field] = undefined
      }
    },
    removeAll() {
      this.$emit('removeAll')
      if (this.isArray) this.model[this.field] = []
      else this.model[this.field] = undefined

      if (!this.selectInput) this.relationList = []
    },
    onRemoveAllTags() {
      this.removeAll()
      this.$emit('input', this.model[this.field])
    },
    search(query) {
      this.inputValue = query
    },
    onSelectRow(row) {
      this.setId(row)
      this.$emit('input', this.model[this.field])
    },
    onRemoveTag(row) {
      if (!row) return
      this.removeId(row.value)
      this.$emit('input', this.model[this.field])
    },
    onOpenDropdown() {
      this.isDropdownOpen = true
    },
    onCloseDropdown() {
      this.isDropdownOpen = false
    },
    allowSearch() {
      this.searchableData = true
      this.$nextTick(() => {
        this.$refs.select?.focus?.()
        this.$refs.select?.showPopup?.()
      })
    },
    activateSubscription(allAccessible = true) {
      if (this.readonly && this.emptyId) return

      const oldHandler = this.handler
      this.ready = false

      const where = this.where
      const value = allAccessible ? this.value : undefined
      const locale = I18n?.getLanguage ? I18n.getLanguage() : 'en'

      if (this.options) {
        this.populate()
        this.ready = true
        this.$emit('ready')
        return
      }

      if (this.subscription && Meteor?.subscribe) {
        this.handler = Meteor.subscribe(
          this.subscription,
          this.getId,
          value,
          locale,
          where,
          this.readonly
        )

        const run = Tracker?.autorun
        if (typeof run === 'function') {
          run(() => {
            if (this.handler?.ready?.()) {
              if (oldHandler?.stop) oldHandler.stop()
              this.populate()
              this.ready = true
              this.$emit('ready')
            }
          })
          return
        }

        const timer = setInterval(() => {
          if (this.handler?.ready?.()) {
            clearInterval(timer)
            if (oldHandler?.stop) oldHandler.stop()
            this.populate()
            this.ready = true
            this.$emit('ready')
          }
        }, 50)
        return
      }

      if (this.meteorMethod && Meteor?.call) {
        Meteor.call(
          this.meteorMethod,
          this.getId,
          value,
          locale,
          where,
          this.readonly,
          (err, result) => {
            if (err) {
              this.errorCallback(err, result)
            } else {
              this.populate(result)
              this.ready = true
              this.$emit('ready')
            }
          }
        )
        return
      }

      this.populate()
      this.ready = true
      this.$emit('ready')
    },
    populate(records) {
      if (this.options) {
        this.relationList = this.options
        return
      }

      this.relationList = this.getOptionsFromRelations(records)
      if (this.relationList.length === 1 && !this.optional) {
        this.setId(this.relationList[0])
        if (this.selectInput && !this.definition?.searchable) {
          this.searchableData = false
          this.disabledData = !this.optional
        }
      }
    },
    getOptionsFromRelations(records) {
      const definition = this.definition
      const relationClass = definition?.relation
      const where = this.where
      if (!relationClass) return []

      const mapRecords = (list) =>
        list
          .map((record) => {
            const relation = record?.defaultName ? record : new relationClass(record)
            return {
              value: relation?._id,
              text: relation?.defaultName?.() || relation?._id,
              record
            }
          })
          .sort((a, b) => (a.text <= b.text ? -1 : 1))

      if (Array.isArray(records)) return mapRecords(records)

      const cursor = relationClass.find?.(where?.search || {})
      const fetched = cursor?.fetch ? cursor.fetch() : cursor || []
      return mapRecords(fetched)
    }
  }
}