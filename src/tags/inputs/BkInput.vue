<!-- We added $parent.$attrs to get the "non-props" attributes from "bk-form" element -->
<!-- Slot <field>-form-group will replace all the bk-input (no b-card or form-group) -->
<!-- Slot <field>-label will replace the label -->
<!-- Slot <field> will replace the field's inner input -->
<template>
  <transition name="slide-fade" appear>
    <slot :name="formGenericFieldComputed + '-form-group'" v-bind="$props">
      <q-expansion-item
        v-if="ui.collapsible || ui.accordion"
        v-model="accordionOpen"
        :group="ui.accordion ? accordionGroupId : void 0"
        expand-separator
        :class="'q-mb-sm ' + this.model.constructor.getName()"
        :id="field"
      >
        <template #header>
          <q-item-section>
            <slot :name="formFieldComputed + '-label'" v-bind="$props">
              <bk-label v-bind="$props" noRequired/>
            </slot>
          </q-item-section>
        </template>

        <q-card-section>
          <bk-inner-input
              v-bind="{...$parent.$attrs,...$props, ...$attrs}"
              @state="onState"
              @validationError="onError"
              :model="inputModel"
              @input="$emit('input')"
              @change="$emit('change')"
              @select="$emit('select',$event)"
              @tag="$emit('tag',$event)"
          >
            <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
              <slot :name="slot" v-bind="props" />
            </template>
          </bk-inner-input>

          <div v-if="state === false" class="text-negative text-caption q-mt-xs" v-html="invalidFeedback"/>
        </q-card-section>
      </q-expansion-item>
      <div v-else-if="ui.basic" class="q-mb-sm">
        <div class="col-12 basic-group" :class="accordionGroupId" :id="field">
          <slot :name="formFieldComputed + '-label'" v-bind="$props">
            <bk-label v-bind="$props" noRequired/>
          </slot>
        </div>
        <bk-inner-input
                v-bind="{...$parent.$attrs,...$props, ...$attrs}"
                @state="onState"
                @validationError="onError"
                @input="$emit('input')"
                @change="$emit('change')"
                @select="$emit('select',$event)"
                @tag="$emit('tag',$event)"
                :model="inputModel">

          <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
            <slot :name="slot" v-bind="props" />
          </template>

        </bk-inner-input>

        <div v-if="state === false" class="text-negative text-caption q-mt-xs" v-html="invalidFeedback"/>
      </div>
      <div v-else-if="canView" class="q-mb-md">
        <slot :name="formGenericFieldComputed + '-label'" v-bind="$props">
          <bk-label v-bind="{...$props,...$attrs}"/>
        </slot>

        <div v-if="description" class="text-caption text-grey-7 q-mb-xs">{{ description }}</div>

        <bk-inner-input
            v-bind="{...$parent.$attrs,...$props, ...$attrs}"
            @state="onState"
            @validationError="onError"
            @input="$emit('input')"
            @select="$emit('select',$event)"
            @tag="$emit('tag',$event)"
            :model="inputModel">

          <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
            <slot :name="slot" v-bind="props" />
          </template>

        </bk-inner-input>

        <div v-if="state === false" class="text-negative text-caption q-mt-xs" v-html="invalidFeedback"/>
      </div>
    </slot>
  </transition>
</template>

<script>
  import { Class, I18n } from '../../bridge/context'
  import _ from 'lodash'
  import BkLabel from '../forms/BkLabel.vue'

  export default {
    name: "BkInput",
    components: {BkLabel},
    props: {
      model: {
        type: Class,
        required: true
      },
      field: {
        type: String,
        required: true
      },
      for: String,
      formField: String,
      formGenericField: String,
      noLabel: Boolean,
    },
    // Pay attention that injected objects are not reactive
    inject: ["formModel"],
    data() {
      return {
        invalidFeedback: null,
        state: null,
        accordionOpen: true,
      }
    },

    /* Use of meteor instead of computed here implies version 2+ of vue-meteor-tracker */
    computed: {
      // model from props or injection
      inputModel() {
        return this.model || this.formModel;
      },
      // Used for slots, we do not have index for arrays, so all fields in array are replaced
      formGenericFieldComputed() {
        if (this.formGenericField) return this.formGenericField + "." + this.field;
        return this.formFieldComputed;
      },
      formFieldComputed() {
        return this.formField && this.formField + "." + this.field || this.field;
      },
      // If for view or if readonly field, return true
      plaintext() {
        if (this.$props.for === "view") {
          return true;
        }
        if (!this.inputModel.canEdit(this.field)) {
          return true;
        }
        return this.$props.plaintext;
      },
      canView() {
        return this.inputModel.canView(this.field,undefined,this.formModel);
      },
      placeholder() {
        return "Enter " + this.field
      },
      validFeedback() {
        return ""
      },
      ui() {
        if (this.noUI) {return {}};
        return this.definition.ui || {};
      },
      definition() {
        return this.model.getDefinition(this.field) || {};
      },
      // If accordion, only one open
      // if not, all will be opened at start
      accordionId() {
        return "Collapse_" + this.field + "_" + this._uid;
      },
      accordionGroupId() {
        if (this.ui.accordion || this.ui.basic) {
          return this.model.constructor.getName();
        } else {
          return this.model.constructor.getName()+'_' + this._uid;
        }
      }
    },
    meteor: {
      description() {
        if (this.plaintext) return
        if (this.model.constructor.parentClassName === "ParameterTableElement")
          return this.model.constructor.getDescription(this.field)

        return I18n.t(this.model.constructor.getDescriptionKey(this.field),{ignoreNotFound: true})
      },
    },
    methods: {
      onState(state) {
        this.state = state;
      },
      onError(error) {
        this.invalidFeedback = error;
      },
      toggleAccordion() {
        this.accordionOpen = !this.accordionOpen
      },
    }
  }
</script>

<style scoped>
  /* Les animations d'entrée (« enter ») et de sortie (« leave »)  */
  /* peuvent utiliser différentes fonctions de durée et de temps.  */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
  </style>