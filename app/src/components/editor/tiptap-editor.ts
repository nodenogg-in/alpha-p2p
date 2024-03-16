import { StarterKit } from '@tiptap/starter-kit'
import { Link } from '@tiptap/extension-link'
import { CharacterCount } from '@tiptap/extension-character-count'
import { Document } from '@tiptap/extension-document'
import { Placeholder } from '@tiptap/extension-placeholder'
import type { Extensions } from '@tiptap/core'
import { MAX_CHARACTER_COUNT } from '@nodenogg.in/schema'

// import { TaskList } from '@tiptap/extension-task-list'
// import { TaskItem } from '@tiptap/extension-task-item'

// Todo: allow these items to be sanitised? Allows ability for check lists
// TaskList,
// TaskItem,

const NodeDocument = Document.extend({
  content: 'heading block*'
})

export const extensions: Extensions = [
  // NodeDocument,
  StarterKit.configure({
    // document: false
  }),
  Link.configure({
    HTMLAttributes: {
      rel: 'noopener noreferrer',
      target: null
    },
    linkOnPaste: true
  }),
  CharacterCount.configure({
    limit: MAX_CHARACTER_COUNT
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === 'heading') {
        return 'Add text'
      }
      return 'Add text'
    }
  })
]
