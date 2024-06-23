import React from 'react';
import { Button } from './ui/button';

export default function ClosePortalAlert() {
  return (
    <div className="grid-design flex w-5/6 flex-col items-center justify-center space-y-2 py-6 px-16">
      <h1 className="font-heading  text-5xl text-foreground">Flowplane</h1>
      <p className="text-lg text-muted-foreground">
        Close your Portal window to use the editor
      </p>
      <Button
        variant="link"
        className="text-muted-foreground shadow-none"
        onClick={() => {
          localStorage.setItem('portalOpen', '');
          window.location.reload();
        }}
      >
        Portal already closed?
      </Button>
    </div>
  );
}
