export default function Settings() {
  return <div className="bg-accent w-5/6 text-accent-foreground p-4 flex justify-center">
    <div className="border-border/40 border rounded-md w-full h-full p-12">
      <div>
        <div className="flex items-center justify-between">
          <div>
                <h1 className="font-heading text-lg tracking-wide">Portal Shortcut</h1>
              <p className="text-muted-foreground">Shortcut used to open the Portal Plane</p>
            </div>
        Ctrl+L
        </div>
                <hr className="mt-4 border-muted-foreground/30"></hr>
      </div>
    </div>
  </div>;
}

