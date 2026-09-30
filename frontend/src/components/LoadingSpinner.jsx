import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ label = 'Loading StudentHub...' }) => (
  <div className="flex flex-col items-center justify-center p-12 space-y-3 min-h-[250px]">
    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
    <p className="text-sm font-medium text-slate-400">{label}</p>
  </div>
);

export default LoadingSpinner;
