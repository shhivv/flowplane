import { MdBlurLinear } from "react-icons/md";
import { GiBlackHoleBolas } from "react-icons/gi";
import { twMerge } from "tailwind-merge";

import React, { FormEvent, useState } from "react";

import {
  useLoadedPlanesStore,
  convertEnum,
  useMainDisplayedPlane,
} from "../state/plane";
import { useViewStore } from "../state/view";

export default function NewPlane() {
  const [selectedType, setSelectedType] = useState("linear");
  const addLoadedPlane = useLoadedPlanesStore((lp) => lp.add);
  const changeToPlaneView = useViewStore((v) => v.setPlane);
  const changePlane = useMainDisplayedPlane((c) => c.setPlaneId);
  const [title, setTitle] = useState("");

  const onSelect = (e: React.MouseEvent) => {
    setSelectedType(e.currentTarget.id);
  };

  const onTitleChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newPlane = {
      title: title || "Untitled",
      plane_type: convertEnum(selectedType),
    };

    const addedPlane = await addLoadedPlane(newPlane);
    changeToPlaneView();
    changePlane(addedPlane.id!);
  };

  return (
    <div className="w-10/12 flex justify-center items-center text-sm text-muted-foreground grid-design">
      <div className=" w-2/5 h-1/2 flex flex-col  justify-center items-center rounded-lg bg-gradient-to-b drop-shadow-xl from-primary/20 to-background/30">
        <div className="flex w-3/4 py-3">
          <h1 className="text-foreground font-heading">Create new Plane</h1>
        </div>
        <form
          className="flex flex-col items-center justify-center w-3/4 space-y-2"
          onSubmit={onSubmit}
        >
          <input
            type="text"
            placeholder="Title"
            className="py-3 w-full px-4 rounded-md bg-background border-border border outline-none focus:border-primary/50"
            onKeyUp={onTitleChange}
            autoFocus
          ></input>
          <div className="flex space-x-2 py-4 w-full">
            <button
              className={twMerge(
                "py-6 flex rounded-md items-center justify-center flex-col bg-background border border-border hover:bg-accent w-1/2",
                selectedType === "linear" && "border-primary/50 bg-transparent",
              )}
              id="linear"
              onClick={onSelect}
              type="button"
            >
              <MdBlurLinear className="mb-4" /> Linear
            </button>
            <button
              className={twMerge(
                "py-6 flex rounded-md items-center justify-center flex-col bg-background border border-border hover:bg-accent w-1/2",
                selectedType === "slate" && "border-primary/50 bg-transparent",
              )}
              id="slate"
              onClick={onSelect}
              type="button"
            >
              <GiBlackHoleBolas className="mb-4" /> Slate
            </button>
          </div>
          <button
            type="submit"
            className="py-2 w-1/2 px-4 rounded-md bg-primary/70 border transition ease-in-out hover:scale-105 hover:bg-primary/80 duration-300 text-foreground border-primary/80 shadow-xl"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
