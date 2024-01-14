import React from "react";

export default function ClosePortalAlert() {
  return (
    <div className="w-5/6 py-6 px-16 flex justify-center items-center flex-col space-y-2 grid-design">
      <h1 className="font-heading  text-5xl text-foreground">Flowplane</h1>
      <p className="text-muted-foreground text-lg">
        Close your Portal window to use the editor
      </p>
    </div>
  );
}
