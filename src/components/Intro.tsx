import React from 'react';

export default function Introduction() {
  return (
    <div className="grid-design bg-accent flex w-5/6 flex-col items-center justify-center space-y-2 py-6 px-16">
      <h1 className="font-heading  text-5xl text-foreground">Flowplane</h1>
      <p className="text-lg text-muted-foreground">
        Create a new Plane to get started
      </p>
      <p className="text-sm text-muted-foreground/80">
        Built with Rust & Tauri
      </p>
      <a
        href="https://flowplane.shivs.me"
        target="_blank"
        rel="noreferrer"
        className="text-sm text-muted-foreground/80"
      >
        flowplane.shivs.me
      </a>
    </div>
  );
}
