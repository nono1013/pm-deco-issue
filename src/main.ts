import './style.css'
import {EditorState, Plugin} from "prosemirror-state"
import {Decoration, DecorationSet, EditorView} from "prosemirror-view"
import {Schema, DOMParser, Node} from "prosemirror-model"
import {schema} from "prosemirror-schema-basic"
import {addListNodes} from "prosemirror-schema-list"
import {exampleSetup} from "prosemirror-example-setup"

const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks
})

function inlineDeco(doc: Node) {
  return DecorationSet.create(doc, [Decoration.inline(5, 11, {class: "inline"})])
}

let inlinePlugin = new Plugin({
  state: {
    init(_, {doc}) { return inlineDeco(doc) },
    apply(tr, old) { return tr.docChanged ? inlineDeco(tr.doc) : old }
  },
  props: {
    decorations(state) { return this.getState(state) },
  }
})

window.view = new EditorView(document.querySelector("#app"), {
  state: EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(document.querySelector("#content")),
    plugins: [...exampleSetup({schema: mySchema}),inlinePlugin],
  }),
  handleDOMEvents: {
    mousemove: (view, e) => {
      const posAtCoords = view.posAtCoords({
        left: e.clientX,
        top: e.clientY
      })
      const o = document.querySelector("#pos");
      if (o) {
        o.textContent = JSON.stringify(posAtCoords)
      }
    }
  }
})

