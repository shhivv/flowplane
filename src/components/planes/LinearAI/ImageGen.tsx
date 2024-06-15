import { BlockNoteEditor, PartialBlock } from '@blocknote/core';
import { FaPaintBrush } from 'react-icons/fa';

const generateImage = (editor: BlockNoteEditor) => ({
  title: 'AI Image',
  onItemClick: () => {
    const currentBlock = editor.getTextCursorPosition().block;
    // @ts-expect-error okkkkk
    const newBlock: PartialBlock = {
      type: 'image',
      content: [{ type: 'text', text: 'Hello World', styles: { bold: true } }],
    };
    editor.insertBlocks([newBlock], currentBlock, 'after');
  },
  group: 'AI',
  icon: <FaPaintBrush />,
  subtext: 'Generate an AI Image using Stable Diffusion',
});
