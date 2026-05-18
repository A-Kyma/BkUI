<template>
  <div class="bk-text-editor">
    <q-editor
      ref="editor"
      v-bind="$attrs"
      v-model="content"
      @paste="pasteCapture"
      @drop="dropCapture"
      :toolbar="toolbar"
      :definitions="definitions"
      content-class="bk-editor-content"
      min-height="8rem"
    />

    <input
      ref="imageInput"
      class="hidden"
      type="file"
      accept="image/*"
      @change="onImageSelected"
    >
  </div>
</template>

<script>
export default {
  name: 'BkTextEditor',
  emits: ['input', 'update:modelValue'],
  props: {
    // Keep `value` for backward compatibility with Vue2 and `v-model` usage
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      content: this.value || ''
    }
  },
  computed: {
    toolbar() {
      return [
        ['bold', 'italic', 'underline', 'strike'],
        ['undo', 'redo'],
        ['left', 'center', 'right', 'justify'],
        ['unordered', 'ordered', 'outdent', 'indent'],
        ['hr', 'link', 'removeFormat'],
        ['uploadImage', 'imageUrl'],
        ['viewsource']
      ]
    },
    definitions() {
      return {
        uploadImage: {
          tip: 'Upload image',
          icon: 'image',
          label: 'Image',
          handler: this.openImagePicker
        },
        imageUrl: {
          tip: 'Insert image URL',
          icon: 'add_photo_alternate',
          handler: this.insertImageFromUrl
        }
      }
    }
  },
  watch: {
    value(next) {
      const incoming = next || ''
      if (incoming !== this.content) {
        this.content = incoming
      }
    },
    content(next) {
      this.$emit('input', next)
      this.$emit('update:modelValue', next)
    }
  },
  methods: {
    openImagePicker() {
      this.$refs.imageInput?.click()
    },
    insertImageFromUrl() {
      const src = window.prompt('Image URL')
      if (!src) return
      this.insertImage(src)
    },
    onImageSelected(event) {
      const file = event?.target?.files?.[0]
      this.insertImageFromFile(file)

      // Reset input to allow selecting the same file again
      event.target.value = ''
    },
    pasteCapture(event) {
      const file = this.getImageFileFromEvent(event)
      if (!file) return

      event.preventDefault()
      this.insertImageFromFile(file)
    },
    dropCapture(event) {
      const file = this.getImageFileFromEvent(event)
      if (!file) return

      event.preventDefault()
      this.insertImageFromFile(file)
    },
    getImageFileFromEvent(event) {
      const dt = event?.dataTransfer
      const cb = event?.clipboardData
      const files = dt?.files?.length ? dt.files : cb?.files

      if (files?.length) {
        const file = files[0]
        if (file?.type?.startsWith('image/')) return file
      }

      const items = dt?.items?.length ? dt.items : cb?.items
      if (items?.length) {
        for (let i = 0; i < items.length; i += 1) {
          const item = items[i]
          if (item?.type?.startsWith('image/')) {
            return item.getAsFile()
          }
        }
      }

      return null
    },
    insertImageFromFile(file) {
      if (!file || !file.type?.startsWith('image/')) return

      const reader = new FileReader()
      reader.onload = () => {
        this.insertImage(reader.result)
      }
      reader.readAsDataURL(file)
    },
    insertImage(src) {
      const editor = this.$refs.editor
      if (!editor || !src) return

      // Prefer native insertImage command, fallback to raw HTML insertion.
      try {
        editor.runCmd('insertImage', src)
      } catch (e) {
        editor.runCmd('insertHTML', `<img src="${src}" alt="image" />`)
      }
    }
  }
}
</script>

<style scoped>
.bk-text-editor {
  width: 100%;
}

:deep(.bk-editor-content) {
  min-height: 8rem;
}
</style>
  