'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { ListNode, ListItemNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import {
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  EditorState,
  $createParagraphNode,
  $getRoot
} from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from '@lexical/list';
import { $createHeadingNode, $isHeadingNode, HeadingTagType } from '@lexical/rich-text';
import { $isListNode } from '@lexical/list';
import { $setBlocksType } from '@lexical/selection';
import { useEffect, useState } from 'react';


const theme = {
  paragraph: 'text-gray-900',
  heading: {
    h1: 'text-4xl font-bold mb-4 mt-6 text-gray-900',
    h2: 'text-3xl font-bold mb-3 mt-5 text-gray-900',
    h3: 'text-2xl font-semibold mb-2 mt-4 text-gray-900',
  },
  text: {
    bold: 'font-bold text-gray-900',
    italic: 'italic text-gray-900',
    underline: 'underline text-gray-900',
  },
  list: {
    ol: 'list-decimal ml-6 mb-3 text-gray-900',
    ul: 'list-disc ml-6 mb-3 text-gray-900',
    listitem: 'mb-2 text-gray-900',
  }
};


function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [isInList, setIsInList] = useState(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat('bold'));

          const anchorNode = selection.anchor.getNode();
          const element = anchorNode.getKey() === 'root'
            ? anchorNode
            : anchorNode.getTopLevelElementOrThrow();

          const parentElement = element.getParent();
          const inList = $isListNode(parentElement);
          setIsInList(inList);

          if ($isHeadingNode(element)) {
            setBlockType(element.getTag());
          } else if (inList) {
            setBlockType('list');
          } else {
            setBlockType('paragraph');
          }
        }
      });
    });
  }, [editor]);

  const formatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const formatHeading = (headingTag: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingTag));
      }
    });
  };

  const formatParagraph = () => {
    if (isInList) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const insertNumberedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  const insertBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  return (
    <div className="toolbar border-b border-gray-200 p-3 flex gap-2 bg-gradient-to-r from-gray-50 to-gray-100 flex-wrap">
      <div className="flex gap-2">
        <button
          onClick={() => formatParagraph()}
          className={`px-3 py-2 rounded-md font-medium transition-all duration-200 ${
            blockType === 'paragraph'
              ? 'bg-gray-600 text-white border-2 border-gray-700 shadow-md'
              : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm'
          }`}
          title={isInList ? "Keluar dari List / Normal Text" : "Normal Text"}
        >
          P
        </button>
        <button
          onClick={() => formatHeading('h1')}
          className={`px-3 py-2 rounded-md font-bold transition-all duration-200 ${
            blockType === 'h1'
              ? 'bg-indigo-600 text-white border-2 border-indigo-700 shadow-md'
              : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-indigo-50 hover:border-indigo-400 shadow-sm'
          }`}
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => formatHeading('h2')}
          className={`px-3 py-2 rounded-md font-bold transition-all duration-200 ${
            blockType === 'h2'
              ? 'bg-indigo-600 text-white border-2 border-indigo-700 shadow-md'
              : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-indigo-50 hover:border-indigo-400 shadow-sm'
          }`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => formatHeading('h3')}
          className={`px-3 py-2 rounded-md font-bold transition-all duration-200 ${
            blockType === 'h3'
              ? 'bg-indigo-600 text-white border-2 border-indigo-700 shadow-md'
              : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-indigo-50 hover:border-indigo-400 shadow-sm'
          }`}
          title="Heading 3"
        >
          H3
        </button>
      </div>

      <div className="border-l-2 border-gray-300 mx-1"></div>

      <button
        onClick={formatBold}
        className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
          isBold
            ? 'bg-blue-600 text-white border-2 border-blue-700 shadow-md'
            : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-blue-50 hover:border-blue-400 shadow-sm'
        }`}
        title="Bold (Ctrl+B)"
      >
        <strong>B</strong>
      </button>

      <div className="border-l-2 border-gray-300 mx-1"></div>

      <button
        onClick={insertNumberedList}
        className="px-4 py-2 rounded-md font-medium bg-white text-gray-700 border-2 border-gray-300 hover:bg-green-50 hover:border-green-400 shadow-sm transition-all duration-200"
        title="Numbered List"
      >
        1. List
      </button>

      <button
        onClick={insertBulletList}
        className="px-4 py-2 rounded-md font-medium bg-white text-gray-700 border-2 border-gray-300 hover:bg-purple-50 hover:border-purple-400 shadow-sm transition-all duration-200"
        title="Bullet List"
      >
        • List
      </button>
    </div>
  );
}

// Editor configuration
function onError(error: Error) {
  console.error(error);
}

const initialConfig = {
  namespace: 'MyEditor',
  theme,
  onError,
  nodes: [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
  ],
};

interface EditorProps {
  onContentChange?: (content: { text: string; html: string; json: string }) => void;
}

export default function Editor({ onContentChange }: EditorProps) {
  const onChange = (editorState: EditorState, editor: any) => {
    editorState.read(() => {
      const json = JSON.stringify(editorState.toJSON());
      const root = $getRoot();
      const text = root.getTextContent();
      const html = $generateHtmlFromNodes(editor, null);

      if (onContentChange) {
        onContentChange({ text, html, json });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="border-2 border-gray-300 rounded-xl shadow-2xl bg-white overflow-hidden">
        <LexicalComposer initialConfig={initialConfig}>
          <ToolbarPlugin />
          <div className="relative bg-white">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="min-h-[450px] p-6 outline-none text-gray-900 text-lg leading-relaxed focus:bg-blue-50/10" />
              }
              placeholder={
                <div className="absolute top-6 left-6 text-gray-400 text-lg pointer-events-none">
                  Mulai menulis artikel Anda di sini...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <HistoryPlugin />
          <ListPlugin />
          <OnChangePlugin onChange={onChange} />
        </LexicalComposer>
      </div>
    </div>
  );
}
