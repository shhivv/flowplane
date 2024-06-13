import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import { useToast } from './components/ui/use-toast';
import { Input } from './components/ui/input';
import { FaCheck } from 'react-icons/fa';
import { tauri } from '@tauri-apps/api';

export default function Settings() {
  const { toast } = useToast();
  const [loaded, setLoaded] = useState(false);
  const [portalOpenShortcut, setPortalShortcut] = useState('');
  useEffect(() => {
    (async () => {
      const dbconfig = JSON.parse(await tauri.invoke('get_config'));
      setPortalShortcut(dbconfig.portalOpen || 'CmdorCtrl+q');
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
  return (
    <div className="flex w-5/6 justify-center bg-bgshade p-4 text-accent-foreground">
      {loaded && (
        <div className="h-full w-full rounded-md border border-border/40 p-12">
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
        </div>
      )}
    </div>
  );
}
