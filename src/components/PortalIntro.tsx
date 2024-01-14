import React from "react";

export default function PortalIntro() {
  return (
    <div className="w-full py-6 px-16 flex justify-center items-center flex-col space-y-2 grid-design">
      <h1 className="font-heading  text-5xl text-foreground">Flowplane</h1>
      <p className="text-muted-foreground text-lg">
        Select or create a new Plane to get started
      </p>
      <p className="text-muted-foreground/80 text-sm">
        Built with Rust & Tauri
      </p>
      <a
        href="https://flowplane.shivs.me"
        className="text-muted-foreground/80 text-sm"
      >
        flowplane.shivs.me
      </a>
    </div>
  );
}
