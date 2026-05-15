<template>
  <div v-if="editor" class="container">
    <div class="control-group">
      <Teleport to="body" :disabled="!isMobile">
        <q-btn-group unelevated :class="editorToolbarClass">
          <q-btn flat dense icon="format_bold" @click="editor.chain().focus().toggleBold().run()" :disable="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }" />
          <q-btn flat dense icon="format_italic" @click="editor.chain().focus().toggleItalic().run()" :disable="!editor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }" />
          <q-btn flat dense icon="strikethrough_s" @click="editor.chain().focus().toggleStrike().run()" :disable="!editor.can().chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }" />
          <q-btn flat dense icon="code" @click="editor.chain().focus().toggleCode().run()" :disable="!editor.can().chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }" />
          <q-btn flat dense icon="format_clear" @click="editor.chain().focus().unsetAllMarks().run()" />
          <!--        <button @click="editor.chain().focus().clearNodes().run()">-->
          <!--          Clear nodes-->
          <!--        </button>-->
          <!--        <button @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">-->
          <!--          Paragraph-->
          <!--        </button>-->
          <q-btn flat dense label="H1" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }" />
          <q-btn flat dense label="H2" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" />
          <q-btn flat dense label="H3" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }" />
          <!--        <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">-->
          <!--          H4-->
          <!--        </button>-->
          <!--        <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">-->
          <!--          H5-->
          <!--        </button>-->
          <!--        <button @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">-->
          <!--          H6-->
          <!--        </button>-->
          <q-btn flat dense icon="format_list_bulleted" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }" />
          <q-btn flat dense icon="format_list_numbered" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }" />
          <q-btn flat dense icon="code" @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }" />
          <q-btn flat dense icon="format_quote" @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }" />
          <!--        <button @click="editor.chain().focus().setHorizontalRule().run()">-->
          <!--          Horizontal rule-->
          <!--        </button>-->
          <!--        <button @click="editor.chain().focus().setHardBreak().run()">-->
          <!--          Hard break-->
          <!--        </button>-->
          <q-btn flat dense icon="undo" @click="editor.chain().focus().undo().run()" :disable="!editor.can().chain().focus().undo().run()" />
          <q-btn flat dense icon="redo" @click="editor.chain().focus().redo().run()" :disable="!editor.can().chain().focus().redo().run()" />
          <!--        <button @click="editor.chain().focus().setColor('#958DF1').run()" :class="{ 'is-active': editor.isActive('textStyle', { color: '#958DF1' }) }">-->
          <!--          Purple-->
          <!--        </button>-->
        </q-btn-group>
      </Teleport>
    </div>
    <component :is="'EditorContent'" :editor="editor" class="tiptap"/>
  </div>
</template>

<script>
import { Meteor } from '../../bridge/context'
import { Editor } from "@tiptap/core"
import { EditorContent } from "@tiptap/vue-3"
import StarterKit from "@tiptap/starter-kit"
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import ListItem from '@tiptap/extension-list-item'
export default {
  name: "BkTextEditor",
  emits: ['input','update:modelValue'],
  props: {
    // Keep `value` for backward compatibility with Vue2 and `v-model` usage
    value: {
      type: String,
      default: '',
    },
  },
  components: {
    EditorContent,
  },
  data() {
    return {
      editor: null,
      width: window?.innerWidth,
    }
  },
  computed: {
    isMobile() {
      return Meteor.isCordova || this.width < 600
    },
    editorToolbarClass() {
      return this.isMobile ? 'editor-toolbar mobile' : 'editor-toolbar';
    },
  },
  watch: {
    value(value) {
      // HTML
      const isSame = this.editor.getHTML() === value

      // JSON
      // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

      if (isSame) {
        return
      }

      this.editor.commands.setContent(value, false)
    },
  },
  created() {
    window.addEventListener("resize", this.onResize);
  },
  mounted() {
    // Create the editor instance with static imports (Vue 3)
    this.editor = new Editor({
      content: this.value,
      extensions: [
        StarterKit,
        // ListItem,
        Image.configure({
          inline: true,
          allowBase64: true,
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        TextStyle,
        Color.configure({
          types: [TextStyle.name, ListItem.name],
        }),
      ],
      onUpdate: () => {
        // HTML (Vue2 compatibility)
        this.$emit('input', this.editor.getHTML())
        // Vue3 style v-model compatibility
        this.$emit('update:modelValue', this.editor.getHTML())

        // JSON
        // this.$emit('input', this.editor.getJSON())
      },
    })
  },
  methods: {
    onResize(e) {
      this.width = window.innerWidth;
    },
  },
  unmounted() {
    this.editor && this.editor.destroy();
  },
  beforeDestroy() {
    // Vue 2 compatibility
    if (typeof this.unmounted === 'function') this.unmounted();
  },
}
</script>

<style scoped>
.editor-toolbar {
  display: flex;
  flex-wrap: nowrap;
  background: #f8f9fa;
  border-radius: 0.5rem 0.5rem 0 0;
  padding: 0.3rem 0.3rem;
  box-shadow: 0 2px 8px #dee2e6;
  position: sticky;
  top: 0;
  z-index: 10;
  justify-content: flex-start;
  align-items: center;
  /*margin-bottom: 1rem;*/
}

.editor-toolbar button {
  background: none;
  border: none;
  color: #444;
  /*font-size: 1.2rem;*/
  /*padding: 0.4rem 0.6rem;*/
  border-radius: 0.3rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.editor-toolbar button.is-active,
.editor-toolbar button:focus {
  background: #e0e0ff !important;
  color: #5a3ec8 !important;
}

.editor-toolbar button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}


.editor-toolbar.mobile {
  position: sticky;
  bottom: 0;
  top: auto;
  left: 0;
  right: 0;
  z-index: 9999;
  border-radius: 0;
  margin-bottom: 0;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.08);
  justify-content: space-around;
  padding: 0.6rem 0.2rem;
}

.tiptap {
  border: 1px solid #f8f9fa;
  box-shadow: 0 2px 8px #dee2e6;
  border-radius: 0 0 0.5rem 0.5rem;
  padding: 1rem;
  background: #fff;
  min-height: 100px;
}
</style>
  