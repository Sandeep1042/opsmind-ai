import React, { useState, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ChatUI from './components/ChatUI';
import api from './api/apiClient';

const App = () => {
  const [stats, setStats] = useState({ totalDocs: 0, totalChunks: 0, queries: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(`✅ ${res.data.message || 'File uploaded successfully'}`);
      setStats(prev => ({
        ...prev,
        totalDocs: prev.totalDocs + 1,
        totalChunks: prev.totalChunks + res.data.chunks,
      }));
    } catch (err) {
      alert('❌ Upload failed: ' + (err.response?.data?.error || err.message));
    }

    setIsProcessing(false);
  };

  const handleClear = () => {
    setStats({ totalDocs: 0, totalChunks: 0, queries: 0 });
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar
        stats={stats}
        onUpload={handleUpload}
        onClear={handleClear}
        fileInputRef={fileInputRef}
        isProcessing={isProcessing}
      />
      <ChatUI stats={stats} setStats={setStats} />
    </div>
  );
};

export default App;
