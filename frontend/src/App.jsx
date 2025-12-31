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
  const [uploadProgress, setUploadProgress] = useState({ stage: '', percentage: 0 });
  const [uploadNotification, setUploadNotification] = useState(0); // Counter to trigger notification
  const fileInputRef = useRef();

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('opsmindStats', JSON.stringify(stats));
  }, [stats]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsProcessing(true);

    // Progress simulation stages
    const stages = [
      { stage: 'Uploading file...', percentage: 15 },
      { stage: 'Parsing PDF...', percentage: 30 },
      { stage: 'Generating embeddings...', percentage: 55 },
      { stage: 'Storing chunks...', percentage: 80 },
      { stage: 'Finalizing...', percentage: 95 },
    ];

    // Simulate progress stages with timeout
    let stageTimeouts = [];
    let currentStageIndex = 0;
    
    const advanceStage = () => {
      if (currentStageIndex < stages.length) {
        setUploadProgress(stages[currentStageIndex]);
        currentStageIndex++;
        if (currentStageIndex < stages.length) {
          const timeout = setTimeout(advanceStage, 1000); // Move to next stage after 1 second
          stageTimeouts.push(timeout);
        }
      }
    };

    // Set initial stage and start progression
    setUploadProgress(stages[0]);
    currentStageIndex = 1;
    const initialTimeout = setTimeout(advanceStage, 1000);
    stageTimeouts.push(initialTimeout);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // Clear any pending timeouts
      stageTimeouts.forEach(timeout => clearTimeout(timeout));
      setUploadProgress({ stage: 'Complete!', percentage: 100 });
      
      setTimeout(() => {
        // Trigger notification in ChatUI
        setUploadNotification(prev => prev + 1);
        setStats(prev => ({
          ...prev,
          totalDocs: prev.totalDocs + 1,
          totalChunks: prev.totalChunks + (res.data.totalPages || res.data.totalChunks || 0),
        }));
        setUploadProgress({ stage: '', percentage: 0 });
        // Remove alert as notification is now shown in chat
        // alert(`✅ ${res.data.message || 'File uploaded successfully'}`);
      }, 500);
    } catch (err) {
      stageTimeouts.forEach(timeout => clearTimeout(timeout));
      setUploadProgress({ stage: '', percentage: 0 });
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
        uploadProgress={uploadProgress}
      />
      <ChatUI stats={stats} setStats={setStats} uploadNotification={uploadNotification} />
    </div>
  );
};

export default App;
