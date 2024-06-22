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
import { FaHighlighter } from 'react-icons/fa';

interface IPlaneOptions {
  plane: IPlane;
  data?: Promise<string>;
  toggleHighlight?: () => void;
}

export default function PlaneOptions({
  plane,
  data,
  toggleHighlight,
}: IPlaneOptions) {
  async function exportMarkdown() {
    if (data) {
      const blob = new Blob([await data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const download = document.createElement('a');
      download.download = plane.title + '.md';
      download.href = url;
      document.body.appendChild(download);
      download.click();
      document.body.removeChild(download);
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="shadow-none">
          <BsThreeDots />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-border">
        {data ? (
          <DropdownMenuItem asChild>
            <Button
              onClick={exportMarkdown}
              variant="ghost"
              className="w-full justify-start space-x-2 shadow-none"
            >
              <CiExport />
              <span>Export</span>
            </Button>
          </DropdownMenuItem>
        ) : null}
        {toggleHighlight ? (
          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              className="w-full justify-start space-x-2 shadow-none"
              onClick={toggleHighlight}
            >
              <FaHighlighter />
              <span>Toggle Highlights</span>
            </Button>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem asChild>
          <DeletePlane plane={plane} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
