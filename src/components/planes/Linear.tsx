import { type IPlane } from '../../state/plane';
import { MdBlurLinear } from 'react-icons/md';
import React, { useEffect, useState } from 'react';
import DeletePlane from '../DeletePlane';
import { API } from '@editorjs/editorjs';
import { invoke } from '@tauri-apps/api';
import { createReactEditorJS } from 'react-editor-js';

interface ILinear {
  plane: IPlane;
}

const ReactEditorJS = createReactEditorJS();

export default function Linear({ plane }: ILinear) {
  const [data, setData] = useState();
  const [loaded, setLoaded] = useState(false);

  const onChange = (planeId: number) => {
    return async (api: API) => {
      const newData = await api.saver.save();
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
      setData(JSON.parse(fetched as string));
      setLoaded(true);
    };
    fetchData();
  }, [plane.id]);

  return (
    <div className="w-5/6 py-8 px-16 text-neutral-400 font-heading overflow-y-auto">
      <div className="flex text-neutral-500 justify-between">
        <div className="flex items-center space-x-3 w-full">
          <MdBlurLinear />
          <h3 className="w-4/5 overflow-ellipsis whitespace-nowrap overflow-hidden">
            {plane?.title}
          </h3>
        </div>
        <DeletePlane plane={plane} />
      </div>
      {loaded && (
        <ReactEditorJS
          autofocus
          onChange={onChange(plane.id!)}
          placeholder="Type to get started"
          defaultValue={data}
        />
      )}
    </div>
  );
}
