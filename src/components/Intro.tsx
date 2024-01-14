import React from "react";

export default function Introduction() {
  return (
    <div className="w-5/6 py-6 px-16 flex justify-center items-center flex-col space-y-2 grid-design">
      <h1 className="font-heading  text-5xl text-foreground">Flowplane</h1>
      <p className="text-muted-foreground text-lg">
        Create a new Plane to get started
      </p>
      <p className="text-muted-foreground/80 text-sm">
        Built with Rust & Tauri
      </p>
      <a
        href="https://flowplane.shivs.me"
        target="_blank"
        rel="noreferrer"
        className="text-muted-foreground/80 text-sm"
      >
        flowplane.shivs.me
      </a>
    </div>
  );
}
