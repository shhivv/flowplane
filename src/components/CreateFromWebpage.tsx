import {
  AlertDialog,
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

export function CreateFromWebpage() {
  const addLoadedPlane = useLoadedPlanesStore((lp) => lp.add);
  const changeToPlaneView = useViewStore((v) => v.setPlane);
  const changePlane = useMainDisplayedPlane((c) => c.setPlaneId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: 'https://blog.shivs.me/how-random-numbers-work',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const url = values.url;
    const res = await fetch(`https://r.jina.ai/${url}`, {});
    console.log(res);
    const md = await res.text();
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
      <AlertDialogTrigger className="dark flex space-x-2 px-3 text-muted-foreground">
        <span className="rounded bg-primary/30 px-2">AI</span>
        <span className="flex w-full justify-start hover:underline">
          Create from Webpage
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent className="dark z-[1000] border-border font-sans outline-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">
            Create Slate from URL
          </AlertDialogTitle>
          <AlertDialogDescription>
            Enter the URL of the website you want to convert to Slate.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="dark space-y-8"
          >
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="dark">
                  <FormLabel className="text-foreground">URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
                      className="dark text-muted-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogAction asChild>
              <Button type="submit">Submit</Button>
            </AlertDialogAction>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
