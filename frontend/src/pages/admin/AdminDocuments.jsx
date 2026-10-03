import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import dataStore from '../../services/dataStore';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Folder, FileText, Download, ShieldCheck } from 'lucide-react';

const AdminDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    let docs = [];
    try {
      const res = await api.get('/students/me/documents');
      if (res && res.success && Array.isArray(res.data)) {
        docs = res.data;
      }
    } catch (err) {
      console.warn('Document vault API unavailable, reading local dataStore docs:', err);
    }

    if (docs.length === 0) {
      docs = dataStore.getDocuments().map((d) => ({
        id: d.id,
        documentName: d.name,
        documentType: d.category,
        fileSize: '1.4 MB',
        uploadedDate: d.uploadedAt,
        status: d.status,
        fileUrl: '#',
      }));
    }

    setDocuments(docs);
    setLoading(false);
  };

  if (loading) return <LoadingSpinner label="Loading Institutional Document Vault..." />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Institutional Document Repository</h1>
        <p className="text-sm text-slate-400 mt-1">
          Monitor uploaded student transcripts, certificates, bonafide issues, and community documents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div key={doc.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <StatusBadge status={doc.status} />
            </div>

            <h3 className="text-base font-bold text-white">{doc.documentName}</h3>
            <div className="text-xs text-slate-400">
              Type: {doc.documentType} • Size: {doc.fileSize || '1.2 MB'}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-500">{new Date(doc.uploadedDate).toLocaleDateString()}</span>
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>View / Download</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDocuments;
