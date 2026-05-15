<template>
  <div>
    <q-btn color="primary" @click="generateYml">
      Generate YAML
    </q-btn>

    <bk-table
        model="I18n"
        :array="array"
        :fields="fields"
        :per-page="1000"
    >
      <template #head()="{field}">
        {{field}}
      </template>

      <template #cell(_id)="{model,field}">
        <div class="translationkey">{{model[field]}}</div>
      </template>

      <template #cell()="{model,field}">
        <div class="relative-position translation-input-wrap">
          <q-input
            :id="field + '.' + model._id"
            :ref="'input-'+field+'.'+model._id"
            :tabindex="locales.indexOf(field)+1"
            type="text"
            :model-value="model[field]"
            dense
            outlined
            @update:model-value="(val) => { model[field] = val }"
            @focus="toggleState(model,field,null)"
            @blur="saveTranslation(model,field,$event)"
          >
            <template v-if="field!=='fr'" #append>
              <q-btn flat round dense icon="translate" color="primary" @click="onTranslate(model,field)" />
            </template>
          </q-input>
          <q-inner-loading :showing="model.overlay === field">
            <q-spinner color="primary" size="18px" />
          </q-inner-loading>
        </div>
      </template>

    </bk-table>
  </div>
</template>

<script>
import { I18n, Meteor } from '../../bridge/context'
import {dump} from "js-yaml"

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export default {
  name: "BkTranslations",
  props: {
    locales: {
      type: Array,
      default() {return I18n.locales}
    },
  },
  computed: {
    availableKeys() {
      let result=[]
      for (let [key,value] of Object.entries(this.translationsList)) {
        let realKey = key.split(".").slice(1).join(".")
        result.push(realKey)
      }
      return result.filter((item,index) => result.indexOf(item) === index).sort()
    },
    fields(){
      return ["_id"].concat(this.locales)
    },
    array() {
      let result=[]
      this.availableKeys.forEach(key => {
        let elem = {_id: key, overlay: false}
        this.locales.forEach(locale => {
          elem[locale] = this.translationsList[locale + "." + key]
        })
        result.push(elem)
      })
      return result
    }
  },
  meteor: {
    translationsList() {
      return I18n.map.all()
    },
  },
  methods: {
    saveTranslation(model,locale,event) {
      const value = event.target.value
      const id = locale + "." + model._id
      if (this.translationsList[id] === value) return
      if (this.translationsList[id] === undefined && value ==="") return

      console.log("Saving: ",id,value)
      I18n.map.set(id,value)
      this.toggleState(model,locale,true)
    },
    toggleState(model,locale,value) {
      const ref = "input-" + locale + "." + model._id
      this.$refs[ref].state = value
    },
    generateYml() {
      const yml = dump(
          I18n.convertToObjectTranslations(this.translationsList),
          { sortKeys: true, quotingType: '"', forceQuotes: true }
      )
      //console.log(yml)
      download("translations.yml",yml)
    },
    onTranslate(model,locale) {
      model.overlay = locale
      Meteor.call("deeplTranslate", model.fr, locale, (err,result) => {
        if (result) {
          model[locale] = result
          this.saveTranslation(model,locale,{target: {value: result}})
        }
        model.overlay = false
      })
    }
  }
}
</script>

<style scoped>
.translationkey {
  max-width: 200px;
  overflow-wrap: break-word;
}
.input-group {
  width: auto;
  min-width: 300px;
}

.translation-input-wrap {
  min-width: 300px;
}
</style>