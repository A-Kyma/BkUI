<template>
  <div ref="parent" class="full-width block">
    <div class="row q-col-gutter-sm q-mb-sm" v-if="$props['for'] !== 'view'">
      <div class="col" v-if="getTypeField">
        <q-select
          v-model="insertModel.selected"
          :options="enumOptions"
          option-label="key"
          option-value="value"
          emit-value
          map-options
          outlined
          dense
        >
          <template #option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <t>{{scope.opt.key}}</t>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col" v-if="!$attrs.noNumber">
        <q-input type="number" v-model.number="insertModel.number" outlined dense/>
      </div>
      <div class="col-auto">
        <q-btn outline color="secondary" @click="onAddSubClass(0)">
          <t>app.add</t>
        </q-btn>
      </div>
    </div>

    <Container
      ref="container"
      behaviour="move"
      drag-class="card-ghost bg-warning"
      drop-class="card-ghost-drop"
      @drop="onDrop"
      :get-ghost-parent="getGhostParent"
    >

      <Draggable
        v-for="(innerModel,index) in model[field]"
        :key="innerModel._id.valueOf()"
        class="overflow-visible"
      >
        <q-card class="q-mb-sm drag-hover" bordered>
          <q-card-section class="q-pt-sm q-pl-sm q-pr-lg q-pb-none" v-if="getTypeField">


            <bk-view-clean
                v-bind="$attrs"
                :model="innerModel"
                :field="getTypeField"
                :form-field="formField + '.' + index"
                :form-generic-field="formField"
            />

            <bk-button-icon
                    v-if="canDelete"
                    @click="onRemove(index)"
                    icon="trash-fill"
                    variant="danger"
            />
            <!--{{getIndexForModel(innerModel,index)}}-->

            <bk-input
                v-if="innerModel.getDefinition('isActive')!==undefined"
                :model="innerModel"
                field="isActive"
                :for="$props['for']"
                :form-field="formField + '.' + index"
                :form-generic-field="formField"
            />

          </q-card-section>
          <q-card-section class="q-pt-sm q-pl-sm q-pr-lg q-pb-none" v-else>
            <slot name="card-body-prefix"/>
          </q-card-section>
          <bk-field-list
              v-if="innerModel.getDefinition('isActive')===undefined || innerModel.isActive"
              v-bind="$attrs"
              :for="$props['for']"
              :model="innerModel"
              :form-field="formField + '.' + index"
              :form-generic-field="formField"
              :exclude="['isActive',getTypeField]">

            <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
              <slot :name="slot" v-bind="props" />
            </template>

          </bk-field-list>
          <bk-button-icon
              v-if="!getTypeField && canDelete"
              @click="onRemove(index)"
              icon="trash-fill"
              variant="danger"
              class="remove-button"
          />

          <!-- legacy add-footer kept out during Quasar migration -->
        </q-card>
      </Draggable>
    </Container>
    <!-- legacy add-modal kept out during Quasar migration -->
    <div class="row q-col-gutter-sm q-mt-sm" v-if="model[field].length>0 && $props['for'] !== 'view'">
      <div class="col" v-if="getTypeField">
        <q-select
          v-model="insertModel.selected"
          :options="enumOptions"
          option-label="key"
          option-value="value"
          emit-value
          map-options
          outlined
          dense
        >
          <template #option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <t>{{scope.opt.key}}</t>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col" v-if="!$attrs.noNumber">
        <q-input type="number" v-model.number="insertModel.number" outlined dense/>
      </div>
      <div class="col-auto">
        <q-btn outline color="secondary" @click="onAddSubClass(-1)">
          <t>app.add</t>
        </q-btn>
      </div>
    </div>

  </div>
</template>

<script>
import { Class, Enum } from '../../bridge/context'
import BkButtonIcon from "../links/BkButtonIcon.vue";
import BkFieldList from "./BkFieldList.vue";
import BkInput from "../inputs/BkInput.vue";
import BkViewClean from "../views/BkViewClean.vue";
import { Container, Draggable } from "vue-smooth-dnd";
import applyDrag from "../../utils/applyDrag";
import { QSelect, QItem, QItemSection, QInput, QBtn, QCard, QCardSection } from 'quasar'

export default {
    name: "BkCardListClass",
  components: {BkButtonIcon,BkFieldList,BkInput,BkViewClean,Container,Draggable, QSelect, QItem, QItemSection, QInput, QBtn, QCard, QCardSection},
    props: {
      model: Class,
      field: String,
      formField: String,
      for: String
    },
  data() {
    return {
      hoverTrashIcon: false,
      modalModel: undefined,
      indexToAdd: 0,
      insertModel: {
        selected: undefined,
        number: 1,
      },
    }
  },
  computed: {
    getTypeField() {
      let definition = this.model.getDefinition(this.field);
      let subClass = definition.type.class;
      return subClass.definition.typeField;
    },
    /* @deprecated */
    modalId() {
      return this.field + '_' + this._uid;
    },
    /* @deprecated */
    modalModelClass() {
      return this.model.getFieldClass(this.field);
    },
    canDelete() {
      if (this.$props.for === "view") return false;
      return this.model.canUpdate(this.field);
    },
    enumOptions() {
      let subclass = this.model.getFieldClass(this.field);
      if (!subclass?.definition?.typeField) return
      let fieldDefinition = subclass.getDefinition(subclass.definition.typeField);
      if (!fieldDefinition) return

      let fieldType = fieldDefinition.type.name;
      let EnumClass = fieldDefinition.type.class
      if (! Enum.enums[fieldType]) { return }
      return EnumClass.getOptions();
    },
  },
  methods: {
    onAddSubClass(index) {
      if (index === -1) index = this.model[this.field].length

      let typefield = this.getTypeField;
      for (let i=0; i<this.insertModel.number; i++) {
        let innerModel;
        if (typefield) {
          if (!this.insertModel.selected) return
          innerModel = Class.get(this.insertModel.selected);
        }
        else
          innerModel = this.model.getFieldClass(this.field);

        const newInner = new innerModel()
        newInner._getParent = () => this.model
        this.model[this.field].splice(index,0,newInner);
      }
      this.insertModel.selected = undefined
      this.insertModel.number = 1
    },
    /* @deprecated */
    onAdd(index,innerModel) {
      //add a new model of same type afterwards
      let typefield = this.getTypeField;
      if (typefield) {
        this.indexToAdd = index;
        // Ask for new model using same type field
        this.modalModel = new (this.modalModelClass)();
        this.modalModel[typefield] = innerModel[typefield];
        this.$bvModal.show(this.modalId);
      } else {
        this.modalModel = new (this.modalModelClass)();
        this.model[this.field].splice(index,0,this.modalModel)
      }
    },
    onRemove(index) {
      //remove the model
      this.model[this.field].splice(index,1);
    },
    /* @deprecated */
    onHoverTrashIcon(hovered) {
      this.hoverTrashIcon = hovered;
    },
    /* @deprecated */
    onSubmitModal(e) {
      let modelClass = Class.get(this.modalModel.type);
      if (!modelClass) return;
      if (!this.modalModel.isValid(this.getTypeField)) {
        // if modal form content not valid, do not close it
        e.preventDefault();
        return;
      }
      this.model[this.field].splice(this.indexToAdd,0,new modelClass());
    },
    /* @deprecated */
    getIndexForModel(innerModel,index) {
      let typeField = this.getTypeField;
      // TODO: Can't to this, this filter the original Array in this.model !
      this.model[this.field].filter((x) => {
        x[typeField] = innerModel[typeField]
      })
      return index;
    },
    getGhostParent() {
      return document.body
    },
    onDrop(e) {
      applyDrag(this.model[this.field],e)
    }
  },
}
</script>

<style scoped>
.remove-button {
  position: absolute;
  top: 2px;
  right: 4px;
}
.drag-hover:hover {
  cursor: grab;
}
.card-ghost {
  transition: transform 0.18s ease;
  transform: rotateZ(1deg);
  cursor: grabbing;
}
.card-ghost-drop {
  transition: transform 0.18s ease-in-out;
  transform: rotateZ(0deg);
  cursor: grab;
}
/* Drag&Drop prevent drop down to be shown from BkBelongsToMany tag => VueMultiSelect */
.overflow-visible {
  overflow: visible !important;
}
</style>