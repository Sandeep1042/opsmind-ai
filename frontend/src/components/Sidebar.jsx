import React from 'react';
import { Brain, Upload, Trash2 } from 'lucide-react';

const Sidebar = ({ stats, onUpload, onClear, fileInputRef, isProcessing }) => {
  return (
    <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col shadow-glow">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center float">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">OpsMind AI</h1>
            <p className="text-xs text-gray-400">RAG Assistant</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="sidebar-card">
            <div className="value">{stats.totalDocs}</div>
            <h4>Docs</h4>
          </div>
          <div className="sidebar-card">
            <div className="value text-blue-400">{stats.totalChunks}</div>
            <h4>Chunks</h4>
          </div>
          <div className="sidebar-card">
            <div className="value text-green-400">{stats.queries}</div>
            <h4>Queries</h4>
          </div>
        </div>

        {/* Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="btn-gradient w-full"
        >
          {isProcessing ? 'Processing...' : (
            <>
              <Upload className="w-5 h-5 inline mr-2" />
              Upload PDF
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={onUpload}
          style={{ display: 'none' }}
        />

        {/* Clear Button */}
        <button
          onClick={onClear}
          className="btn-danger w-full mt-3"
        >
          <Trash2 className="w-4 h-4 inline mr-2" /> Clear Data
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
