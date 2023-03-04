import { BlockNoteView, useBlockNote } from '@blocknote/react';
import '@blocknote/core/style.css';
import { type IPlane } from '../../state/plane';
import { MdBlurLinear } from 'react-icons/md';
import React from 'react';

interface ILinear {
  plane?: IPlane;
}

export default function Linear({ plane }: ILinear) {
  const editor = useBlockNote();

  return (
    <div className="w-5/6 py-6 px-16 text-neutral-400 font-heading">
      <div className="flex items-center text-neutral-500 space-x-3">
        <MdBlurLinear />
        <h3>{plane?.title}</h3>
      </div>
      <BlockNoteView editor={editor} />
    </div>
  );
}
