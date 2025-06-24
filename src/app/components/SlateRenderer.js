import React from 'react';

function renderLeaf(leaf, children) {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  return children;
}

function renderNode(node, key) {
  if (Text.isText?.(node) || typeof node.text === 'string') {
    return renderLeaf(node, node.text);
  }
  switch (node.type) {
    case 'paragraph':
      return <p key={key}>{node.children && node.children.map(renderNode)}</p>;
    default:
      return <span key={key}>{node.children && node.children.map(renderNode)}</span>;
  }
}

// Main renderer
const SlateRenderer = ({ value }) => {
  if (!Array.isArray(value)) return null;
  return <>{value.map((node, i) => renderNode(node, i))}</>;
};

export default SlateRenderer; 