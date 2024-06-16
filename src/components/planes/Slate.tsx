import { type IPlane } from '../../state/plane';
import { FaMarkdown } from 'react-icons/fa';
import '@mdxeditor/editor/style.css';
// importing the editor and the plugin from their full paths
import { MDXEditor } from '@mdxeditor/editor/MDXEditor';
import {
  markdownShortcutPlugin,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  tablePlugin,
  linkPlugin,
  imagePlugin,
} from '@mdxeditor/editor';

import { invoke } from '@tauri-apps/api';
import { useEffect, useState } from 'react';
import PlaneOptions from '../PlaneOptions';

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
    (async () => {
      const dbData = await invoke('get_slate_data', {
        slatePlaneId: plane.id,
      });
      setData((dbData as string) || '**You** *can* write _markdown_ `here`');
      setLoaded(true);
    })();
  }, [setLoaded, plane]);

  return (
    <div className="h-full w-full space-y-4 overflow-y-auto bg-bgshade py-8 font-sans text-foreground">
      <div className="flex justify-between px-16 text-muted-foreground">
        <div className="flex w-full items-center space-x-3">
          <FaMarkdown />
          <h3 className="w-16 overflow-hidden overflow-ellipsis whitespace-nowrap lg:w-64">
            {plane?.title}
          </h3>
        </div>
        {/* I hate myself for writing this */}
        {!floating && (
          <PlaneOptions
            plane={plane}
            data={
              new Promise((r) => {
                r(data!);
              })
            }
          />
        )}
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
              linkPlugin(),
              imagePlugin(),
            ]}
            onChange={onChange()}
          />
        )}
      </div>
    </div>
  );
}
