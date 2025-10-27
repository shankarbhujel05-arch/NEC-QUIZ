
import React, { useState, useCallback } from 'react';
import { Question } from '../types';
import { UploadCloudIcon } from './icons/UploadCloudIcon';

interface FileUploadScreenProps {
  onLoad: (questions: Question[]) => void;
}

const FileUploadScreen: React.FC<FileUploadScreenProps> = ({ onLoad }) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    setError(null);
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content !== 'string') {
            throw new Error('File content is not a string.');
          }
          const data = JSON.parse(content);
          // Basic validation
          if (Array.isArray(data) && data.every(q => 'text' in q && 'options' in q && 'answer' in q && 'note' in q)) {
            onLoad(data);
          } else {
            throw new Error('Invalid JSON structure. Please check the file format.');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to parse JSON file.');
        }
      };
      reader.onerror = () => {
        setError('Failed to read the file.');
      };
      reader.readAsText(file);
    } else {
      setError('Please upload a valid .json file.');
    }
  }, [onLoad]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      handleFile(event.target.files[0]);
    }
  };
  
  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFile(event.dataTransfer.files[0]);
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };


  return (
    <div className="text-center bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-2xl mx-auto transition-all duration-300">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Welcome to Gemini Quiz Master</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">Load your quiz file to begin your study session.</p>

      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50' : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600'}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadCloudIcon className="w-10 h-10 mb-4 text-slate-500 dark:text-slate-400" />
          <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Quiz file (JSON only)</p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" accept=".json" onChange={handleFileChange} />
      </label>

      {error && <p className="mt-4 text-sm text-red-500 dark:text-red-400">{error}</p>}
      
      <div className="mt-6 text-xs text-slate-500 dark:text-slate-500">
          <p className="font-semibold">JSON Format Example:</p>
          <pre className="mt-2 p-2 bg-slate-100 dark:bg-slate-900 rounded text-left overflow-auto">
{`[
  {
    "text": "Your question here?",
    "options": ["Option 1", "Option 2"],
    "answer": 0,
    "note": "Explanation for the answer."
  }
]`}
          </pre>
      </div>

    </div>
  );
};

export default FileUploadScreen;
