<template>
  <div>
    <div v-if="readonly" class="bk-plaintext">
      {{readonlyValue}}
    </div>
    <div v-else class="row q-col-gutter-sm">
      <div class="col-xs-12 col-md-8">
        <q-date
          ref="datepicker"
          :model-value="dateValue"
          @update:model-value="val => dateValue = val"
          :locale="locale"
          :disable="plaintext"
          first-day-of-week="1"
          class="full-width"
        />
      </div>
      <div class="col-xs-12 col-md-4">
        <q-input
          ref="timepicker"
          :model-value="timeValue"
          @update:model-value="val => timeValue = val"
          type="time"
          :placeholder="labelClose"
          :disable="plaintext || dateValue===undefined"
          outlined
          dense
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Class, DateTime, I18n } from '../../bridge/context'

export default {
  name: "BkDatePicker",
  props: {
    state: Boolean,
    for: String,
    placeholder: String,
    plaintext: Boolean,
    value: Date,
  },
  created() {
    if (this.readonly) return
    let minute = this.value.getMinutes()
    let remainder = minute % 5
    if (remainder !== 0) {
      minute = minute + 5 - remainder
      this.value.setMinutes(minute)
      let d = DateTime.getISODateString(this.value)
      let h = this.timeValue
      this.$emit("input",`${d}T${h}`)
    }


  },
  computed: {
    readonly() {
      return (this.plaintext || this.$props.for === "view")
    },
    dateValue: {
      set(value) {
        let newValue
        if (value === undefined || value === "")
          newValue = undefined
        else
          if (this.timeValue === undefined)
            newValue = value + "T00:00"
          else
            newValue = value + "T" + this.timeValue //,{cast: true}
        // $emit to let BkInnerInput manage setting value into model
        this.$emit("input", newValue)
      },
      get() {
        return this.value
      }
    },
    timeValue: {
      set(value) {
        if (value === undefined || value === "") return
        let d = DateTime.getISODateString(this.value)
        let newValue = d + "T" + value
        // $emit to let BkInnerInput manage setting value into model
        this.$emit("input", newValue)
      },
      get() {
        return DateTime.getTime(this.value)
      }
    },
    readonlyValue() {
      return DateTime.getLongDateTime(this.value,this.locale)
    }
  },
  meteor: {
    labelClose() {
      return I18n.get("app.close")
    },
    locale() {
      return I18n.getLanguage()
    }
  },
  methods: {
    selectTime() {

    }
  },
}
</script>

<style scoped>
.bk-plaintext {
  min-height: 1.5rem;
}

</style>