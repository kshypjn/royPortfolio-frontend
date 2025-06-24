import React, { useMemo, useCallback } from 'react';
import { createEditor, Transforms, Editor, Text } from 'slate';
import { Slate, Editable, withReact, useSlate } from 'slate-react';

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

const ToolbarButton = ({ format, icon, toggleMark }) => {
  const editor = useSlate();
  return (
    <button
      type="button"
      onMouseDown={event => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      className="px-2 py-1 border rounded mx-1 text-xs bg-gray-100 hover:bg-gray-200"
    >
      {icon}
    </button>
  );
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const SlateEditor = ({ value, onChange, label }) => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const safeValue = Array.isArray(value) ? value : initialValue;

  const renderLeaf = useCallback(props => {
    let { children } = props;
    if (props.leaf.bold) {
      children = <strong>{children}</strong>;
    }
    if (props.leaf.italic) {
      children = <em>{children}</em>;
    }
    if (props.leaf.underline) {
      children = <u>{children}</u>;
    }
    return <span {...props.attributes}>{children}</span>;
  }, []);

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="border border-gray-300 rounded-md p-2 bg-white">
        <Slate
          editor={editor}
          value={safeValue}
          onChange={onChange}
        >
          <div className="mb-2 flex gap-1">
            <ToolbarButton format="bold" icon={<b>B</b>} toggleMark={toggleMark} />
            <ToolbarButton format="italic" icon={<i>I</i>} toggleMark={toggleMark} />
            <ToolbarButton format="underline" icon={<u>U</u>} toggleMark={toggleMark} />
          </div>
          <Editable
            renderLeaf={renderLeaf}
            placeholder="Enter rich text..."
            className="min-h-[80px] p-1"
          />
        </Slate>
      </div>
    </div>
  );
};

export default SlateEditor; 