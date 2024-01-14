import { type IPlane } from "../../state/plane";
import { MdBlurLinear } from "react-icons/md";
import React, { useEffect, useState } from "react";
import DeletePlane from "../DeletePlane";
import { API } from "@editorjs/editorjs";
import { invoke } from "@tauri-apps/api";
// @ts-expect-error cjs import
import { createReactEditorJS } from "react-editor-js/dist/react-editor-js.cjs";
import { EDITOR_JS_TOOLS } from "../../tools";

interface ILinear {
  plane: IPlane;
  floating: boolean;
}

const ReactEditorJS = createReactEditorJS();

export default function Linear({ plane, floating }: ILinear) {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState<string>();

  const onChange = () => {
    return async (api: API) => {
      const newData = await api.saver.save();
      await invoke("update_linear_data", {
        linearPlaneId: plane.id,
        newData: JSON.stringify(newData),
      });

      setData(JSON.stringify(newData));
    };
  };

  useEffect(() => {
    async function cback() {
      const dbData = await invoke("get_linear_data", {
        linearPlaneId: plane.id,
      });

      setData(dbData as string);
      setLoaded(true);
    }
    cback();
  }, [setLoaded, plane]);

  return (
    <div className="py-8 px-16 space-y-4 text-foreground font-sans overflow-y-auto w-full h-full">
      <div className="flex text-muted-foreground justify-between">
        <div className="flex items-center space-x-3 w-full">
          <MdBlurLinear />
          <h3 className="w-4/5 overflow-ellipsis whitespace-nowrap overflow-hidden">
            {plane?.title}
          </h3>
        </div>
        {!floating && <DeletePlane plane={plane!} />}
      </div>
      <div className="">
      {loaded && (
        <ReactEditorJS
          autofocus
          onChange={onChange()}
          placeholder="Type to get started"
          defaultValue={JSON.parse(data!)}
          tools={EDITOR_JS_TOOLS}
          key="/"
        />
      )}

      </div>

    </div>
  );
}
