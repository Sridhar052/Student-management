import React from 'react';
import { FolderOpen } from 'lucide-react';

const EmptyState = ({ title = 'No records found', description = 'There are no items to display right now.', icon: Icon = FolderOpen, action }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center glass-card rounded-2xl my-4">
    <div className="p-4 bg-slate-800/80 text-indigo-400 rounded-full mb-4 border border-slate-700/50">
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-lg font-semibold text-slate-200 mb-1">{title}</h3>
    <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
    {action && (
      <div>{action}</div>
    )}
  </div>
);

export default EmptyState;
