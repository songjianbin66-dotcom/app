import React from 'react';
import RichTextEditor from './RichTextEditor.jsx';

function ContentTabPanel({
  beforeEditor = null,
  afterEditor = null,
  footer = null,
  editorKey,
  editorRef,
  html,
  onInput,
  placeholder,
  toolbar = null,
  wrapperClassName = '',
  contentClassName = '',
  placeholderClassName = '',
  counterText = '',
  counterClassName = '',
  editorStyle,
}) {
  return (
    <div className="space-y-4">
      {beforeEditor}
      <RichTextEditor
        editorKey={editorKey}
        ref={editorRef}
        html={html}
        onInput={onInput}
        placeholder={placeholder}
        toolbar={toolbar}
        wrapperClassName={wrapperClassName}
        contentClassName={contentClassName}
        placeholderClassName={placeholderClassName}
        counterText={counterText}
        counterClassName={counterClassName}
        style={editorStyle}
      />
      {afterEditor}
      {footer}
    </div>
  );
}

export default ContentTabPanel;
