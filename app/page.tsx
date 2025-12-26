import Editor from "./components/Editor";

export default function Home() {
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
        <Editor />
      </div>
    </div>
  );
}
