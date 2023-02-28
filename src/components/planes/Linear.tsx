import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";

export default function () {
  const editor = useBlockNote();

  return (
    <div className="w-5/6 py-6 px-16">
      <BlockNoteView editor={editor} />
    </div>
  );
}
