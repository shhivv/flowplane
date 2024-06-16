import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormEvent, useState } from 'react';
import { invoke } from '@tauri-apps/api';


export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [enabled, setEnabled] = useState(true);
  async function invokePrompt(e: FormEvent) {
    e.preventDefault();
    if(!enabled) {
      return;
    }
    setEnabled(false);
    setOutput("Waiting for response...");
    const resp = await invoke("prompt_ollama", {
      prompt
    });
    setOutput(resp as string);
    setPrompt("");
    setEnabled(true);
  }

  return (
    <div className="grid-design flex flex-col w-10/12 items-center justify-between pb-12 pt-12 bg-bgshade text-muted-foreground space-y-6">
      <div className="w-2/3 flex-1 overflow-y-auto flex justify-end">
      <div className="bg-background lg:w-5/6 w-full text-foreground border text-base h-min justify-end p-5 rounded-lg whitespace-pre-wrap">{output.trim()}
      </div>
      </div>
      <form className="w-2/3 overflow-hidden rounded-lg border bg-background flex-none" onSubmit={invokePrompt}>
      <Label htmlFor="message" className="sr-only">
        Message
      </Label>
      <Textarea
        id="message"
        placeholder="Type your message here..."
        className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        value={prompt}
        disabled={!enabled}
        onChange={(e) => setPrompt(e.currentTarget.value)}
        onKeyDown={(e) => e.key === "Enter" && invokePrompt(e)}
      />
      <div className="flex items-center p-3 pt-0">
        <Button type="submit" size="sm" className="ml-auto gap-1.5">
          Send Message
        </Button>
      </div>
    </form>
    </div>
  );
}
