import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { z } from 'zod';

const formSchema = z.object({
  url: z.string().url('Must be a valid URL'),
});

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  convertEnum,
  useLoadedPlanesStore,
  useMainDisplayedPlane,
} from '@/state/plane';
import { useViewStore } from '@/state/view';
import { invoke } from '@tauri-apps/api';
import { AlertDialogAction } from '@radix-ui/react-alert-dialog';
import { useToast } from './ui/use-toast';

function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function CreateFromWebpage() {
  const addLoadedPlane = useLoadedPlanesStore((lp) => lp.add);
  const changeToPlaneView = useViewStore((v) => v.setPlane);
  const changePlane = useMainDisplayedPlane((c) => c.setPlaneId);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const url = values.url;
    toast({
      description: 'Retriving page. This may take a while. (10-200 seconds)',
    });
    const res = await invoke('get_markdown', {
      url,
    });
    let md = (await res) as string;
    if (isJsonString(md)) {
      md = JSON.parse(md).readableMessage;
    }
    const newPlane = {
      title: url,
      plane_type: convertEnum('slate'),
    };
    const addedPlane = await addLoadedPlane(newPlane);
    await invoke('update_slate_data', {
      slatePlaneId: addedPlane.id,
      newData: md,
    });
    changeToPlaneView();
    changePlane(addedPlane.id!);
    return true;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex space-x-2 px-3">
        <Button variant="ghost" className="space-x-2 shadow-none w-full flex items-center justify-center">
          <span className="rounded bg-primary/30 px-2">AI</span>
          <span className="flex justify-start">Create from Webpage</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-border outline-none">
        <AlertDialogHeader>
          <AlertDialogTitle>Create Slate from URL</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the URL of the website you want to convert to Slate.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button type="submit">Submit</Button>
              </AlertDialogAction>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
