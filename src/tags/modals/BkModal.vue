<template>
  <q-dialog
    ref="modal"
    v-model="openData"
    @show="onShow"
    @hide="$emit('hide')"
    @after-show="$emit('shown')"
  >
    <q-card class="bk-modal-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          <slot name="title">
            <t>{{title}}</t>
          </slot>
        </div>
      </q-card-section>

      <q-card-section>
        <bk-loading v-if="!!subscription && !$subReady[subscription]  && !firstSubReady" type="dots"/>
        <slot v-else name="default" v-bind="{model: findModel}"></slot>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat color="secondary" @click="hide()">
          <t>app.cancel</t>
        </q-btn>
        <q-btn color="primary" @click="onOkClick">
          <slot name="ok">
            <t>app.ok</t>
          </slot>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { Class } from '../../bridge/context'

export default {
  name: "BkModal",
  props: {
    id: String,
    model: Class,
    field: String,
    title: {
      type: String,
      default: "app.chooseType"
    },
    subscription: String,
  },
  data() {
    return {
      firstSubReady: false,
      openData: false
    }
  },
  computed: {
    findModel() {
      if (!this.subscription)
        return this.model
      else {
        this.firstSubReady = true
        return this.$autorun(() =>
            this.model.constructor.findOne(this.model._id)
        )
      }
    },
  },
  methods: {
    onOkClick() {
      const event = {
        defaultPrevented: false,
        preventDefault() {
          this.defaultPrevented = true
        }
      }
      this.onOk(event)
      if (!event.defaultPrevented) this.hide()
    },
    onOk(e) {
      this.$emit("ok",e);
    },
    onShow() {
      this.$emit('show')
      if (!!this.subscription)
        this.$subscribe(this.subscription,[this.model._id])
    },
    show() {
      this.openData = true
    },
    hide() {
      this.openData = false
    }
  },
}
</script>

<style scoped>
.bk-modal-card {
  min-width: min(92vw, 720px);
}

  .BkButton:hover{
    transform:scale(1.3);
  }
</style>