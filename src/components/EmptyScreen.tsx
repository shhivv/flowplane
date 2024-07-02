export function EmptyScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <h1 className="text-3xl font-bold text-center">Welcome to Flowplane Chat!</h1>
      <p className="text-center text-lg text-muted-foreground">
        Start a conversation by typing a message in the box below.
      </p>
    </div>
  );
}
