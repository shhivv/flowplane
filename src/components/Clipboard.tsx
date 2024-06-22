import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useClipboardStore } from '@/state/clipboard';
import { useEffect } from 'react';
import { useToast } from './ui/use-toast';

export default function Clipboard() {
  const clips = useClipboardStore((c) => c.clips);
  const fetch = useClipboardStore((c) => c.fetch);
  const { toast } = useToast();
  useEffect(() => {
    (async () => {
      await fetch();
    })();
  }, [fetch]);
  return (
    <div className="grid-design flex w-10/12 justify-center bg-bgshade pt-32 text-sm text-muted-foreground">
      <Command className="h-5/6 max-h-min w-2/3">
        <CommandInput placeholder="Search for clips" className="h-16" />
        <CommandList className="max-h-[1/2]">
          <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
            Copy some text to get started! Make sure clipboards are enabled in
            settings.
          </CommandEmpty>
          <CommandGroup heading="Suggestions">
            {clips.map((v, k) => (
              <CommandItem
                className="whitespace-pre-wrap border border-bgshade py-6 font-mono text-muted-foreground hover:cursor-pointer"
                key={k}
                value={v + String(k)}
                onSelect={() => {
                  navigator.clipboard.writeText(v);
                  toast({
                    variant: 'default',
                    title: 'Copied to clipboard',
                  });
                }}
              >
                {v}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
