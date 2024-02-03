import { IPlane } from '@/state/plane';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { BsThreeDots } from 'react-icons/bs';
import { CiExport } from 'react-icons/ci';
import DeletePlane from './DeletePlane';
import { Button } from './ui/button';

interface IPlaneOptions {
  plane: IPlane;
  data: Promise<string>;
}
export default function PlaneOptions({ plane, data }: IPlaneOptions) {
  async function exportMarkdown() {
    const blob = new Blob([await data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const download = document.createElement('a');
    download.download = plane.title + '.md';
    download.href = url;
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <BsThreeDots />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dark border-border bg-background font-sans">
        <DropdownMenuItem asChild>
          <Button
            onClick={exportMarkdown}
            variant="ghost"
            className="w-full justify-start space-x-2"
          >
            <CiExport />
            <span>Export</span>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <DeletePlane plane={plane} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
