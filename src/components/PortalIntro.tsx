import React from 'react';

export default function PortalIntro() {
  return (
    <div className="grid-design flex w-full flex-col items-center justify-center space-y-2 px-16 py-6">
      <h1 className="font-heading  text-5xl text-foreground">Flowplane</h1>
      <p className="text-lg text-muted-foreground">
        Select or create a new Plane to get started
      </p>
      <p className="text-sm text-muted-foreground/80">
        Built with Rust & Tauri
      </p>
      <a
        href="https://flowplane.shivs.me"
        className="text-sm text-muted-foreground/80"
      >
        flowplane.shivs.me
      </a>
    </div>
  );
}
