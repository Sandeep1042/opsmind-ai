import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatUI from './components/ChatUI';
import api from './api/apiClient';

const App = () => {
  const [stats, setStats] = useState(() => {
    // Load stats from localStorage on initial load
    const savedStats = localStorage.getItem('opsmindStats');
    return savedStats ? JSON.parse(savedStats) : { totalDocs: 0, totalChunks: 0, queries: 0 };
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef();

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('opsmindStats', JSON.stringify(stats));
  }, [stats]);

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
        totalChunks: prev.totalChunks + (res.data.totalPages || res.data.totalChunks || 0),
      }));
    } catch (err) {
      alert('❌ Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      // Reset file input so the same file can be uploaded again
      fileInputRef.current.value = '';
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    const emptyStats = { totalDocs: 0, totalChunks: 0, queries: 0 };
    setStats(emptyStats);
    localStorage.setItem('opsmindStats', JSON.stringify(emptyStats));
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
