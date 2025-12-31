import React from 'react';
import { Brain, Upload, Trash2, Loader } from 'lucide-react';

const Sidebar = ({ stats, onUpload, onClear, fileInputRef, isProcessing, uploadProgress }) => {
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
            <h4>Pages</h4>
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

        {/* Progress Bar */}
        {isProcessing && uploadProgress.stage && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 flex items-center gap-2">
                {uploadProgress.percentage < 100 ? (
                  <Loader className="w-3 h-3 animate-spin" />
                ) : null}
                {uploadProgress.stage}
              </span>
              <span className="text-xs text-gray-500">{uploadProgress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div 
                className="progress-bar-fill h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress.percentage}%` }}
              />
            </div>
          </div>
        )}

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
