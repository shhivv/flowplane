import { type IPlane } from '../../state/plane';
import { MdBlurLinear } from 'react-icons/md';
import React, { useEffect, useMemo, useState } from 'react';
import { invoke } from '@tauri-apps/api';
import { Block, BlockNoteEditor, PartialBlock } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/shadcn';
import '@blocknote/shadcn/style.css';

import PlaneOptions from '../PlaneOptions';

interface ILinear {
  plane: IPlane;
  floating: boolean;
}

export default function Linear({ plane, floating }: ILinear) {
  const [initialContent, setInitialContent] = useState<
    PartialBlock[] | undefined | 'loading'
  >('loading');
  const [highlights, setHighlights] = useState(false);

  const editor = useMemo(() => {
    if (initialContent === 'loading') {
      return undefined;
    }
    return BlockNoteEditor.create({ initialContent });
  }, [initialContent]);

  const saveToStorage = (jsonBlocks: Block[]) => {
    const action = async () => {
      await invoke('update_linear_data', {
        linearPlaneId: plane.id,
        newData: JSON.stringify(jsonBlocks),
      });
    };

    action();
  };

  useEffect(() => {
    (async () => {
      const dbData = await invoke('get_linear_data', {
        linearPlaneId: plane.id,
      });
      setInitialContent(JSON.parse(dbData as string) || undefined);
    })();
  }, [plane]);

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
            data={editor?.blocksToMarkdownLossy(editor.document)}
            toggleHighlight={() => setHighlights(!highlights)}
          />
        )}
      </div>
      <div className={`px-7 ${highlights ? 'onlyHighlights' : ''}`}>
        {editor && (
          <BlockNoteView
           data-color-scheme="light"
            // @ts-expect-error fix type error
            editor={editor}
            onChange={() => {
              saveToStorage(editor!.document);
            }}
          />
        )}
      </div>
    </div>
  );
}
