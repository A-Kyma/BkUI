<template>
  <span>
  <slot name="lifecycle" v-bind="{classDefinition, model,field, value}">
    <q-btn v-if="classDefinitionName === 'Lifecycle'" name="lifecycle"
              :color="classDefinition.getStateVariant(model[field])"
              rounded disable>
      <t :key="value" :locale="locale" :options="options">{{value}}</t>
    </q-btn>

    <span v-for="(text, index) in value" v-else-if="classDefinitionName === 'ListEnum'">
      <span v-if="index !== 0">, </span>
      <t :key="text" :locale="locale">{{text}}</t>
    </span>

    <t v-else-if="classDefinitionName === 'Enum'" :key="value" :locale="locale" :options="options">
      {{value}}
    </t>

    <q-icon v-else-if="classDefinitionName === 'Color'" icon="Circle" :color="value"></q-icon>

    <q-checkbox v-else-if="classDefinitionName === 'Boolean'" v-model="value" disable/>

    <q-avatar v-else-if="classDefinitionName === 'Avatar'"
              v-bind="$attrs"
    >
      <img :src="staticLink(fileFormat)"/>
    </q-avatar>

    <q-rating
        v-else-if="classDefinitionName === 'Rating'"
        v-model="value"
        readonly
        v-bind="$attrs"
    />

    <q-linear-progress
      v-else-if="classDefinitionName === 'Percentage'"
      :value="value/100"
      show-progress
      animated
      stripe
    >
      <div class="absolute-full flex flex-center">
        <q-bar v-if="value" :label="value + '%'"/>
      </div>
    </q-linear-progress>

    <span v-else-if="classDefinitionName==='TextEditor'" v-html="value">
    </span>

    <span v-else>{{value}}</span>
  </slot>
  </span>

</template>

<script>
import { QBtn, QIcon, QCheckbox, QAvatar, QRating, QLinearProgress, QBar } from "quasar";
import {Class,ListField, Lifecycle, Enum, Meteor} from "../../bridge/context"

export default {
  name: "BkViewClean",
  components: {QBtn, QIcon, QCheckbox, QAvatar, QRating, QLinearProgress, QBar},
  props: {
    model: {
      type: Class,
      required: true
    },
    field: String,
    format: String,
    locale: String,
    options: {
      type: [Object, Array],
      default() { return {}}
    },
    fileFormat: {
      type: String,
      default: "normal"
    }
  },
  computed: {
    classDefinition() {
      return this.model.getFieldClass(this.field);
    },
    classDefinitionName() {
      let definition = this.model.getDefinition(this.field)
      let fieldClass = this.classDefinition
      if (Enum.includes(fieldClass) && definition instanceof ListField) return "ListEnum"
      if (Enum.includes(fieldClass)) return "Enum"
      if (Lifecycle.includes(fieldClass)) return "Lifecycle"
      return definition.type.name
    },
  },

  meteor: {
    value() {
      return this.model.getValue(this.field, this.format);
    }
  },

  methods: {
    staticLink(format) {
      let fileId = this.value
      if (!format) format="original"
      if (fileId === undefined && this.default) return this.default
      if (fileId === undefined) return
      return Meteor.absoluteUrl("/cdn/storage/Files/" + fileId + "/" + format + "/" + fileId + ".jpg")
    },
  },
}
</script>

<style scoped>

</style>