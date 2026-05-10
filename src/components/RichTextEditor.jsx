import React, { forwardRef } from 'react';

const RichTextEditor = forwardRef(function RichTextEditor(
  {
    editorKey,
    html,
    onInput,
    placeholder,
    toolbar = null,
    wrapperClassName = '',
    contentClassName = '',
    placeholderClassName = '',
    counterText = '',
    counterClassName = '',
    style,
  },
  ref
) {
  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`.trim()} style={style}>
      {toolbar}
      <div
        key={editorKey}
        ref={ref}
        contentEditable
        onInput={onInput}
        className={contentClassName}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {!html && (
        <div className={`pointer-events-none absolute ${placeholderClassName}`.trim()}>
          {placeholder}
        </div>
      )}
      {counterText ? (
        <div className={`absolute ${counterClassName}`.trim()}>
          {counterText}
        </div>
      ) : null}
    </div>
  );
});

export default RichTextEditor;
