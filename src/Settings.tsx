import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import { useToast } from './components/ui/use-toast';
import { Input } from './components/ui/input';
import { FaCheck } from 'react-icons/fa';
import { tauri } from '@tauri-apps/api';
import { DEFAULT_ENABLE_CLIPBOARD, DEFAULT_PORTAL_SHORTCUT } from './constants';
import { Checkbox } from '@/components/ui/checkbox';
import { ModeToggle } from './components/ui/mode-toggle';

export default function Settings() {
  const { toast } = useToast();
  const [loaded, setLoaded] = useState(false);
  const [portalOpenShortcut, setPortalShortcut] = useState('');
  const [enableClipboard, setEnableClipboard] = useState('');

  useEffect(() => {
    (async () => {
      const dbconfig = JSON.parse(await tauri.invoke('get_config'));
      setPortalShortcut(dbconfig.portalOpen || DEFAULT_PORTAL_SHORTCUT);
      setEnableClipboard(dbconfig.enableClipboard || DEFAULT_ENABLE_CLIPBOARD);
      setLoaded(true);
    })();
  }, []);

  async function changeShortcut() {
    await tauri.invoke('set_key', {
      key: 'portalOpen',
      value: portalOpenShortcut,
    });
    toast({
      description: 'Updated shortcut. Restart app to reflect changes.',
    });
  }

  async function changeClipboard() {
    await tauri.invoke('set_key', {
      key: 'enableClipboard',
      value: String(enableClipboard === 'true' ? 'false' : 'true'),
    });
    toast({
      description: 'Updated clipboard settings.',
    });
    setEnableClipboard(enableClipboard === 'true' ? 'false' : 'true');
  }
  return (
    <div className="flex w-5/6 justify-center bg-bgshade p-4 text-accent-foreground">
      {loaded && (
        <div className="h-full w-full space-y-8 rounded-md border border-border/40 p-12">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading tracking-wide">Portal Shortcut</h1>
                <p className="text-sm text-muted-foreground">
                  Shortcut used to open the Portal Plane. Restart the app to
                  save changes.
                </p>
              </div>
              <div className="flex space-x-2">
                <Input
                  defaultValue={portalOpenShortcut}
                  onKeyUp={(e) => setPortalShortcut(e.currentTarget.value)}
                ></Input>
                <Button onClick={changeShortcut}>
                  <FaCheck />
                </Button>
              </div>
            </div>
            <hr className="mt-4 border-muted-foreground/30"></hr>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading tracking-wide">
                  Clipboard logging
                </h1>
                <p className="text-sm text-muted-foreground">
                  Allow Flowplane to automatically monitor and log clipboard
                  content.
                </p>
              </div>
              <div className="flex space-x-2">
                <Checkbox
                  className="h-6 w-6"
                  checked={enableClipboard === 'true'}
                  onCheckedChange={changeClipboard}
                />
              </div>
            </div>
            <hr className="mt-4 border-muted-foreground/30"></hr>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading tracking-wide">Theme</h1>
                <p className="text-sm text-muted-foreground">
                  Change Flowplane theme
                </p>
              </div>
              <div className="flex space-x-2">
                <ModeToggle />
              </div>
            </div>
            <hr className="mt-4 border-muted-foreground/30"></hr>
          </div>
        </div>
      )}
    </div>
  );
}
