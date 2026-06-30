import React, { useState } from 'react';
import { teklaProjectData, ProjectFile, ProjectFolder } from './data/tekla-project';
import { CodeViewer } from './components/CodeViewer';
import { Folder, FolderOpen, FileCode2, Code2, Download, TerminalSquare } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

function App() {
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root', 'domain', 'ui', 'integration']));

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const renderTree = (item: ProjectFolder | ProjectFile, depth = 0) => {
    if ('type' in item && item.type === 'folder') {
      const isExpanded = expandedFolders.has(item.id);
      return (
        <div key={item.id} className="select-none">
          <div
            className={cn(
              "flex items-center py-2 px-3 hover:bg-slate-800/50 cursor-pointer text-slate-300 transition-colors mx-2 rounded-lg",
              depth === 0 ? "font-bold text-slate-200 mt-2" : ""
            )}
            style={{ paddingLeft: `${depth * 16 + 12}px` }}
            onClick={() => toggleFolder(item.id)}
          >
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 mr-3 text-cyan-500 shrink-0" />
            ) : (
              <Folder className="w-4 h-4 mr-3 text-cyan-500 shrink-0" />
            )}
            <span className="text-xs font-medium tracking-wide">{item.name}</span>
          </div>
          {isExpanded && (
            <div className="flex flex-col">
              {item.children.map(child => renderTree(child, depth + 1))}
            </div>
          )}
        </div>
      );
    } else {
      const fileItem = item as ProjectFile;
      const isSelected = selectedFile?.id === fileItem.id;
      const isCSharp = fileItem.language === 'csharp';
      const isXml = fileItem.language === 'xml';
      
      return (
        <div
          key={fileItem.id}
          className={cn(
            "flex items-center py-2 px-3 cursor-pointer transition-colors text-xs font-medium tracking-wide mx-2 rounded-lg my-0.5",
            isSelected ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent"
          )}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => setSelectedFile(fileItem)}
        >
          {isCSharp ? (
            <Code2 className="w-4 h-4 mr-3 text-cyan-600 shrink-0" />
          ) : isXml ? (
            <FileCode2 className="w-4 h-4 mr-3 text-cyan-600 shrink-0" />
          ) : (
            <TerminalSquare className="w-4 h-4 mr-3 text-slate-600 shrink-0" />
          )}
          <span className="truncate">{fileItem.name}</span>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0F1115] text-slate-300 font-sans overflow-hidden select-none">
      {/* Sidebar Navigation */}
      <div className="w-80 flex flex-col border-r border-slate-800 bg-[#16191F] shadow-xl z-10">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500 rounded-md flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white uppercase leading-none">Tekla Assistant</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">C# Solution Explorer</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {renderTree(teklaProjectData)}
        </div>
        <div className="p-4 border-t border-slate-800 bg-[#16191F]">
          <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-widest font-semibold text-center">
            Engineering Suite v1.0.0
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0F1115] relative">
        {/* Subtle Grid Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        {selectedFile ? (
          <div className="flex flex-col h-full z-10">
            <div className="h-14 border-b border-slate-800 flex items-center px-6 bg-[#16191F] shadow-sm justify-between shrink-0">
              <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                {selectedFile.language === 'csharp' ? (
                  <Code2 className="w-4 h-4 mr-3 text-cyan-500" />
                ) : selectedFile.language === 'xml' ? (
                  <FileCode2 className="w-4 h-4 mr-3 text-cyan-400" />
                ) : (
                  <TerminalSquare className="w-4 h-4 mr-3 text-slate-500" />
                )}
                {selectedFile.path || selectedFile.name}
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(selectedFile.content)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-[10px] uppercase tracking-widest font-bold border border-slate-600 transition-colors text-white"
              >
                Copy Source
              </button>
            </div>
            <div className="flex-1 overflow-hidden relative p-6">
              <div className="h-full rounded-2xl border border-slate-800 shadow-2xl bg-[#16191F] overflow-hidden">
                <CodeViewer code={selectedFile.content} language={selectedFile.language} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 z-10 p-8">
            <div className="p-6 bg-[#16191F] rounded-3xl border border-slate-800 shadow-2xl flex flex-col items-center max-w-md w-full">
              <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Code2 className="w-8 h-8 text-cyan-500" />
              </div>
              <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-2">No Module Selected</h2>
              <p className="text-xs text-slate-400 text-center leading-relaxed">
                Use the Solution Explorer to navigate the project architecture and view the C# implementation details.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
