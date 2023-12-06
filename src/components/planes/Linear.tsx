import { useDisplayedPlaneStore, type IPlane } from '../../state/plane';
import { MdBlurLinear } from 'react-icons/md';
import React, { useEffect, useState } from 'react';
import DeletePlane from '../DeletePlane';
import { API } from '@editorjs/editorjs';
import { invoke } from '@tauri-apps/api';
import { createReactEditorJS } from 'react-editor-js';
import { EDITOR_JS_TOOLS } from '../../tools';

interface ILinear {
  plane: IPlane;
  floating: boolean;
}

const ReactEditorJS = createReactEditorJS();

export default function Linear({ plane, floating }: ILinear) {
  const [loaded, setLoaded] = useState(false);
  const displayedPlane = useDisplayedPlaneStore((dp) => dp.plane);
  const [data, setData] = useState<string>();

  const onChange = (planeId: number) => {
    return async (api: API) => {
      const newData = await api.saver.save();
      setData(JSON.stringify(newData));
      await invoke('update_linear_data', {
        linearPlaneId: plane.id,
        newData: JSON.stringify(newData),
      });
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetched = await invoke('get_linear_data', {
        linearPlaneId: plane.id,
      });
      setData(fetched as string);
      setLoaded(true);
    };
    fetchData();
  }, [plane.id]);

  return (
    <div className="py-8 px-16 space-y-4 text-neutral-300 font-sans overflow-y-auto">
      <div className="flex text-neutral-400 justify-between">
        <div className="flex items-center space-x-3 w-full">
          <MdBlurLinear />
          <h3 className="w-4/5 overflow-ellipsis whitespace-nowrap overflow-hidden">
            {plane?.title}
          </h3>
        </div>
        { !floating && <DeletePlane plane={plane} />}
      </div>
      {loaded && (
        <ReactEditorJS
          autofocus
          onChange={onChange(plane.id!)}
          placeholder="Type to get started"
          defaultValue={JSON.parse(data!)}
          tools={EDITOR_JS_TOOLS}
          key="/"
        />
      )}
    </div>
  );
}
