import { type IPlane } from '../../state/plane';
import { MdBlurLinear } from 'react-icons/md';
import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api';

import { BlockNoteEditor } from '@blocknote/core';
import { BlockNoteView, useBlockNote } from '@blocknote/react';

import '@blocknote/react/style.css';
import PlaneOptions from '../PlaneOptions';

interface ILinear {
  plane: IPlane;
  floating: boolean;
}

export default function Linear({ plane, floating }: ILinear) {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [highlights, setHighlights] = useState(false);

  const editor: BlockNoteEditor = useBlockNote(
    {
      initialContent: data,
      _tiptapOptions: {
        autofocus: true,
      },
    },
    [data]
  );

  editor.onEditorContentChange(() => {
    const action = async () => {
      const newData = editor.topLevelBlocks;
      await invoke('update_linear_data', {
        linearPlaneId: plane.id,
        newData: JSON.stringify(newData),
      });
    };
    if (loaded) {
      action();
    }
  });

  useEffect(() => {
    async function cback() {
      const dbData = await invoke('get_linear_data', {
        linearPlaneId: plane.id,
      });
      setData(JSON.parse((dbData as string) || '[]'));
      setLoaded(true);
    }
    cback();
  }, [setLoaded, plane]);

  return (
    <div className="h-full w-full space-y-4 overflow-y-auto bg-bgshade py-8 font-sans text-foreground">
      <div className="flex justify-between px-16 text-muted-foreground">
        <div className="flex w-full items-center space-x-3">
          <MdBlurLinear />
          <h3 className="w-16 overflow-hidden overflow-ellipsis whitespace-nowrap lg:w-64">
            {plane?.title}
          </h3>
        </div>
        {!floating && (
          <PlaneOptions
            plane={plane}
            data={editor.blocksToMarkdownLossy(data)}
            toggleHighlight={() => setHighlights(!highlights)}
          />
        )}
      </div>
      <div className="px-7">
        {loaded && (
          <BlockNoteView
            spellCheck="false"
            className={`bg-bgshade ${highlights ? 'onlyHighlights' : ''}`}
            editor={editor}
          />
        )}
      </div>
    </div>
  );
}
