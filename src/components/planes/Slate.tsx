import { type IPlane } from '../../state/plane';
import { FaMarkdown } from 'react-icons/fa';
import '@mdxeditor/editor/style.css';
import {
  MDXEditor,
  markdownShortcutPlugin,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  tablePlugin,
  linkPlugin,
  imagePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
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

  useEffect(() => {
    const update = async () => {
      await invoke('update_slate_data', {
        slatePlaneId: plane.id,
        newData: data,
      });
    };

    const timeout = setTimeout(() => {
      update();
    }, 200);

    return () => clearTimeout(timeout);
  }, [data, plane.id]);

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
            className={
              document.getElementsByClassName('dark').length ? 'dark-theme' : ''
            }
            contentEditableClassName="twindprose"
            markdown={data as string}
            plugins={[
              headingsPlugin(),
              listsPlugin(),
              quotePlugin(),
              thematicBreakPlugin(),
              tablePlugin(),
              linkPlugin(),
              imagePlugin(),
              codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
              codeMirrorPlugin({
                codeBlockLanguages: {
                  js: 'JavaScript',
                  css: 'CSS',
                  bash: 'Bash',
                },
              }),
              markdownShortcutPlugin(),
            ]}
            onChange={(d) => setData(d)}
          />
        )}
      </div>
    </div>
  );
}
