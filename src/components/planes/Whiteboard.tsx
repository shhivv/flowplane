import { type IPlane } from '../../state/plane';
import { MdOutlineDraw } from 'react-icons/md';
import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api';

import '@blocknote/react/style.css';
import PlaneOptions from '../PlaneOptions';
import {
  Editor,
  TLEditorSnapshot,
  TLOnMountHandler,
  Tldraw,
  getSnapshot,
} from 'tldraw';

interface IWhiteboard {
  plane: IPlane;
  floating: boolean;
}

export default function Whiteboard({ plane, floating }: IWhiteboard) {
  const [snapshot, setSnapshot] = useState<TLEditorSnapshot | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function cback() {
      const dbData = await invoke('get_whiteboard_data', {
        whiteboardPlaneId: plane.id,
      });
      if (dbData) {
        const [document, session] = (dbData as string[]).map((i) =>
          JSON.parse(i)
        );
        setSnapshot({ document, session });
      }
      setLoaded(true);
    }
    cback();
  }, [plane.id]);

  const editorOnMount = (editor: Editor) => {
    editor.store!.listen(
      () => {
        const { document, session } = getSnapshot(editor.store!);

        invoke('update_whiteboard_data', {
          whiteboardPlaneId: plane.id,
          docState: JSON.stringify(document),
          seshState: JSON.stringify(session),
        });
      },
      { scope: 'document', source: 'user' }
    );
  };

  return (
    <div className="h-full w-full space-y-4 overflow-y-auto bg-bgshade py-8 font-sans text-foreground">
      <div className="flex justify-between px-16 text-muted-foreground">
        <div className="flex w-full items-center space-x-3">
          <MdOutlineDraw />
          <h3 className="w-16 overflow-hidden overflow-ellipsis whitespace-nowrap lg:w-64">
            {plane?.title}
          </h3>
        </div>
        {!floating && <PlaneOptions plane={plane} />}
      </div>
      <div className="h-[95%] w-full">
        {loaded ? (
          <Tldraw
            snapshot={snapshot ? snapshot : undefined}
            onMount={editorOnMount as unknown as TLOnMountHandler}
            autoFocus
            inferDarkMode
            components={{
              PageMenu: null,
              DebugMenu: null,
              DebugPanel: null,
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
