import { MdBlurLinear } from "react-icons/md";
import { GiBlackHoleBolas } from "react-icons/gi";
import { useRecoilState, atom } from "recoil";
import { twMerge } from "tailwind-merge";

const selectedState = atom({
  key: "selectedState",
  default: "",
});

const titleState = atom({
  key: "titleState",
  default: "",
});

export default function () {
  const [selectedType, setSelectedType] = useRecoilState(selectedState);
  const [title, setTitle] = useRecoilState(titleState);

  const onSelect = (e: React.MouseEvent) => {
    setSelectedType(e.currentTarget.id);
  };

  const onTitleChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e.currentTarget.value);
    setTitle(e.currentTarget.value);
  };

  return (
    <div className="w-10/12 flex justify-center items-center text-sm text-neutral-400">
      <form className="flex flex-col items-center justify-center py-24 w-1/4 space-y-2">
        <input
          type="text"
          placeholder="Title"
          className="py-2 w-full px-4 rounded-md bg-neutral-900"
          onKeyDown={onTitleChange}
        ></input>
        <div className="flex space-x-2 py-4 w-full">
          <div
            className={twMerge(
              "py-6 flex rounded-md items-center justify-center flex-col border border-neutral-900 hover:bg-neutral-800 w-1/2",
              selectedType === "linear" && "bg-neutral-900" 
            )}
            id="linear"
            onClick={onSelect}
          >
            <MdBlurLinear className="mb-4" /> Linear
          </div>
          <div
            className={twMerge(
              "py-6 flex rounded-md items-center justify-center flex-col border border-neutral-900 hover:bg-neutral-800 w-1/2",
              selectedType === "freeflow" && "bg-neutral-900" 
            )}
            id="freeflow"
            onClick={onSelect}
          >
            <GiBlackHoleBolas className="mb-4" /> FreeFlow
          </div>
        </div>
        <button
          type="submit"
          className="py-2 w-1/2 px-4 rounded-md bg-neutral-900"
        >
          Create
        </button>
      </form>
    </div>
  );
}
