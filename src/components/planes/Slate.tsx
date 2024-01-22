import { type IPlane } from '../../state/plane';
import { GiBlackHoleBolas } from 'react-icons/gi';
import DeletePlane from '../DeletePlane';
import '@mdxeditor/editor/style.css';
// importing the editor and the plugin from their full paths
import { MDXEditor } from '@mdxeditor/editor/MDXEditor';
import {
  markdownShortcutPlugin,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
} from '@mdxeditor/editor';

import { invoke } from '@tauri-apps/api';
import { useEffect, useState } from 'react';

interface ISlate {
  plane: IPlane;
  floating: boolean;
}

export default function Slate({ plane, floating }: ISlate) {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState<string>();

  const onChange = () => {
    return async (newData: string) => {
      await invoke('update_slate_data', {
        slatePlaneId: plane.id,
        newData,
      });

      setData(data);
    };
  };

  useEffect(() => {
    async function cback() {
      const dbData = await invoke('get_slate_data', {
        slatePlaneId: plane.id,
      });
      setData((dbData as string) || '**You** *can* write _markdown_ `here`');
      setLoaded(true);
    }
    cback();
  }, [setLoaded, plane]);

  return (
    <div className="h-full w-full space-y-4 overflow-y-auto py-8 font-sans text-foreground">
      <div className="flex justify-between px-16 text-muted-foreground">
        <div className="flex w-full items-center space-x-3">
          <GiBlackHoleBolas />
          <h3 className="w-4/5 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {plane?.title}
          </h3>
        </div>
        {!floating && <DeletePlane plane={plane!} />}
      </div>
      <div className="px-20">
        {loaded && (
          <MDXEditor
            autoFocus={{ defaultSelection: 'rootEnd' }}
            className="dark-theme dark-editor"
            contentEditableClassName="twindprose"
            markdown={data as string}
            plugins={[
              headingsPlugin(),
              markdownShortcutPlugin(),
              listsPlugin(),
              quotePlugin(),
              thematicBreakPlugin(),
              tablePlugin(),
            ]}
            onChange={onChange()}
          />
        )}
      </div>
    </div>
  );
}
