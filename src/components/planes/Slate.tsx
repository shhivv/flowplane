import { type IPlane } from "../../state/plane";
import { GiBlackHoleBolas } from "react-icons/gi";
import DeletePlane from "../DeletePlane";
import "@mdxeditor/editor/style.css";

// importing the editor and the plugin from their full paths
import { MDXEditor } from "@mdxeditor/editor/MDXEditor";
import {
  markdownShortcutPlugin,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
} from "@mdxeditor/editor";

import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";

interface ISlate {
  plane: IPlane;
}

export default function Slate({ plane }: ISlate) {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState<string>();

  const onChange = () => {
    return async (newData: string) => {
      await invoke("update_slate_data", {
        slatePlaneId: plane.id,
        newData,
      });

      setData(data);
    };
  };

  useEffect(() => {
    async function cback() {
      const dbData = await invoke("get_slate_data", {
        slatePlaneId: plane.id,
      });

      setData((dbData as string) || "");
      setLoaded(true);
    }
    cback();
  }, [setLoaded, plane]);

  return (
    <div className="py-8 px-16 space-y-4 text-neutral-300 font-sans overflow-y-auto w-full">
      <div className="flex text-neutral-400 justify-between">
        <div className="flex items-center space-x-3 w-full">
          <GiBlackHoleBolas />
          <h3 className="w-4/5 overflow-ellipsis whitespace-nowrap overflow-hidden">
            {plane?.title}
          </h3>
        </div>
        {true && <DeletePlane plane={plane} />}
      </div>
      <div className="h-full ">
        {loaded && (
          <MDXEditor
            className="dark-theme dark-editor"
            contentEditableClassName="twindprose"
            markdown={data as string}
            plugins={[
              headingsPlugin(),
              markdownShortcutPlugin(),
              listsPlugin(),
              quotePlugin(),
              thematicBreakPlugin(),
              linkPlugin(),
              linkDialogPlugin(),
              tablePlugin(),
            ]}
            onChange={onChange()}
          />
        )}
      </div>
    </div>
  );
}
