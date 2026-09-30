import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStyle = (st) => {
    const s = String(st || '').toUpperCase();
    switch (s) {
      case 'APPROVED':
      case 'PAID':
      case 'DISBURSED':
      case 'VERIFIED':
      case 'ACTIVE':
      case 'PASS':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />,
        };
      case 'PENDING':
      case 'APPLIED':
      case 'NOT_APPLIED':
      case 'NOT_APPLICABLE':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: <Clock className="w-3.5 h-3.5 mr-1 text-amber-400" />,
        };
      case 'UNDER_REVIEW':
      case 'PARTIAL':
        return {
          bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
          icon: <RefreshCw className="w-3.5 h-3.5 mr-1 text-indigo-400 animate-spin" />,
        };
      case 'REJECTED':
      case 'FAILED':
      case 'INACTIVE':
      case 'FAIL':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: <XCircle className="w-3.5 h-3.5 mr-1 text-rose-400" />,
        };
      default:
        return {
          bg: 'bg-slate-700/50 text-slate-300 border-slate-600',
          icon: <AlertCircle className="w-3.5 h-3.5 mr-1 text-slate-400" />,
        };
    }
  };

  const style = getStyle(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${style.bg} backdrop-blur-sm`}
    >
      {style.icon}
      {String(status || 'N/A').replace(/_/g, ' ')}
    </span>
  );
};

export default StatusBadge;
