'use client';

import Editor from "./components/Editor";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState({ text: '', html: '', json: '' });

  const handleContentChange = (newContent: { text: string; html: string; json: string }) => {
    setContent(newContent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Editor Berita
          </h1>
          <p className="text-gray-600 text-lg">
            Test 123
          </p>
        </div>
        <Editor onContentChange={handleContentChange} />

        {/* Preview Section */}
        {content.text && (
          <div className="max-w-4xl mx-auto mt-8">
            <div className="border-2 border-green-300 rounded-xl shadow-2xl bg-white overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-4 border-b border-green-200">
                <h2 className="text-2xl font-bold text-gray-900">Preview Hasil</h2>
                <p className="text-gray-600 text-sm mt-1">Tampilan dengan format lengkap</p>
              </div>
              <div className="p-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200 prose prose-lg max-w-none">
                  <div
                    className="lexical-preview"
                    dangerouslySetInnerHTML={{ __html: content.html }}
                    style={{
                      fontFamily: 'inherit',
                      lineHeight: '1.75'
                    }}
                  />
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <details className="cursor-pointer">
                    <summary className="font-semibold text-gray-700 hover:text-blue-600">
                      Lihat Plain Text
                    </summary>
                    <div className="mt-3 bg-gray-50 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-gray-800 text-sm">
                        {content.text}
                      </pre>
                    </div>
                  </details>
                  <details className="cursor-pointer mt-2">
                    <summary className="font-semibold text-gray-700 hover:text-blue-600">
                      Lihat JSON Data
                    </summary>
                    <div className="mt-3 bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-xs font-mono">
                        {JSON.stringify(JSON.parse(content.json), null, 2)}
                      </pre>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
