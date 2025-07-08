import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Folder, ArrowLeft, Upload, Ban } from 'lucide-react';
import { FictionalFile, FictionalFolder } from '../types';
import { fileSystemData } from '../data/fileSystem';
import FileIcon from './FileIcon';

interface FileExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: FictionalFile | null) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ isOpen, onClose, onFileSelect }) => {
  const [currentFolder, setCurrentFolder] = useState<FictionalFolder | null>(null);
  const [selectedFile, setSelectedFile] = useState<FictionalFile | null>(null);

  // Reset state when the explorer is closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentFolder(null);
        setSelectedFile(null);
      }, 300); // Wait for closing animation
    }
  }, [isOpen]);
  
  const handleFolderClick = (folder: FictionalFolder) => {
    setCurrentFolder(folder);
    setSelectedFile(null);
  };
  
  const handleBackClick = () => {
    setCurrentFolder(null);
    setSelectedFile(null);
  };

  const handleFileClick = (file: FictionalFile) => {
    setSelectedFile(file);
  };

  const handleUpload = () => {
    onFileSelect(selectedFile);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-slate-200 dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-3xl h-[80vh] max-h-[700px] flex flex-col"
          >
            {/* Header */}
            <header className="flex-shrink-0 flex items-center justify-between p-3 border-b border-slate-300 dark:border-slate-700">
                <div className="flex items-center gap-2">
                    {currentFolder && (
                         <button onClick={handleBackClick} className="p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"><ArrowLeft size={20} /></button>
                    )}
                    <h3 className="text-lg font-semibold">{currentFolder ? `Explorer > ${currentFolder.name}` : 'File Explorer'}</h3>
                </div>
                <button onClick={onClose} className="p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"><X size={20} /></button>
            </header>

            {/* Content */}
            <main className="flex-grow p-4 overflow-y-auto">
              {!currentFolder ? (
                // Folder View
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {fileSystemData.map(folder => (
                    <button key={folder.name} onClick={() => handleFolderClick(folder)} className="flex flex-col items-center p-4 rounded-lg hover:bg-blue-200/50 dark:hover:bg-blue-900/40 transition-colors">
                      <Folder size={48} className="text-yellow-500" />
                      <span className="mt-2 text-sm font-medium text-center break-words">{folder.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                // File View
                <div className="space-y-1">
                  {currentFolder.files.map(file => (
                    <button
                      key={`${file.name}.${file.extension}`}
                      onClick={() => handleFileClick(file)}
                      className={`w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors ${selectedFile === file ? 'bg-blue-500/80 text-white' : 'hover:bg-slate-300/70 dark:hover:bg-slate-700/70'}`}
                    >
                      <FileIcon extension={file.extension} />
                      <span className="flex-grow font-medium truncate">{`${file.name}.${file.extension}`}</span>
                      <span className={`text-sm ${selectedFile === file ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>{formatSize(file.size)}</span>
                    </button>
                  ))}
                </div>
              )}
            </main>

            {/* Footer */}
            <footer className="flex-shrink-0 flex items-center justify-between p-3 border-t border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedFile ? `Selected: ${selectedFile.name}.${selectedFile.extension}` : 'No file selected.'}
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-md bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 transition-colors">Cancel</button>
                    <button onClick={handleUpload} disabled={!selectedFile} className="px-4 py-2 text-sm font-semibold text-white rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
                        {selectedFile ? <Upload size={16}/> : <Ban size={16} />}
                        <span>Upload</span>
                    </button>
                </div>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FileExplorer;
