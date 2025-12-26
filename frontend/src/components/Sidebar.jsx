import React from 'react';
import { Brain, Upload, FileText, Database, Trash2 } from 'lucide-react';

const Sidebar = ({ stats, onUpload, onClear, fileInputRef, isProcessing }) => {
  return (
    <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">OpsMind AI</h1>
            <p className="text-xs text-gray-400">RAG Assistant</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gray-800 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.totalDocs}</div>
            <div className="text-xs text-gray-400">Docs</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.totalChunks}</div>
            <div className="text-xs text-gray-400">Chunks</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.queries}</div>
            <div className="text-xs text-gray-400">Queries</div>
          </div>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
        >
          {isProcessing ? 'Processing...' : (<><Upload className="w-5 h-5" /> Upload PDF</>)}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={onUpload}
          style={{ display: 'none' }}
        />
        <button
          onClick={onClear}
          className="mt-3 w-full text-xs text-red-400 hover:text-red-300 flex items-center justify-center gap-2"
        >
          <Trash2 className="w-3 h-3" /> Clear Data
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
