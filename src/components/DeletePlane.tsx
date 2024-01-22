import { BsTrashFill } from 'react-icons/bs';
import {
  IPlane,
  useMainDisplayedPlane,
  useLoadedPlanesStore,
} from '../state/plane';
import { useViewStore } from '../state/view';
import { invoke } from '@tauri-apps/api';
import { Button } from '@/components/ui/button';
import { TrashIcon } from '@radix-ui/react-icons';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from './ui/use-toast';

interface IDeletePlane {
  plane: IPlane;
}

export default function DeletePlane({ plane }: IDeletePlane) {
  const changeToIntro = useViewStore((v) => v.setIntro);

  const fetch = useLoadedPlanesStore((lp) => lp.fetch);
  const changePlane = useMainDisplayedPlane((c) => c.setPlaneId);
  const { toast } = useToast();
  const onClick = async () => {
    await invoke('delete_plane', { planeId: plane.id! });
    toast({
      variant: 'destructive',
      title: 'Plane Deleted',
      description: `Plane ${plane.title} deleted`,
    });
    const fetched = await fetch();

    if (fetched.lastAccessed) {
      changePlane(fetched.lastAccessed!.id!);
    } else {
      changeToIntro();
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="hover:text-red-500" variant="ghost">
          <BsTrashFill />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="dark border-border font-sans outline-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">
            Delete Plane?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-muted-foreground">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild onClick={onClick}>
            <Button variant="destructive">Delete</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
