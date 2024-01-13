import React from "react";

export default function Introduction() {
  return (
    <div className="w-5/6 py-6 px-16 flex justify-center items-center flex-col space-y-2 grid-design">
      <h1 className="font-heading  text-5xl text-neutral-300">Flowplane</h1>
      <p className="text-neutral-400 text-lg">
        Create a new Plane to get started
      </p>
      <p className="text-neutral-500 text-sm">Built with Rust & Tauri</p>
      <a href="https://flowplane.shivs.me" className="text-neutral-500 text-sm">
        flowplane.shivs.me
      </a>
    </div>
  );
}
