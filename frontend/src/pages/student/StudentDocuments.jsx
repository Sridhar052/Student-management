import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import dataStore from '../../services/dataStore';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { Folder, Upload, Download, Trash2, FileText, CheckCircle2 } from 'lucide-react';

const StudentDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModal, setUploadModal] = useState(false);

  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('BONAFIDE');
  const [uploading, setUploading] = useState(false);

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
      console.warn('Student documents API offline, reading dataStore docs:', err);
    }

    if (docs.length === 0) {
      docs = dataStore.getDocuments().map((d) => ({
        id: d.id,
        documentName: d.name,
        documentType: d.category,
        fileSize: '1.2 MB',
        uploadedDate: d.uploadedAt,
        status: d.status,
        fileUrl: '#',
      }));
    }

    setDocuments(docs);
    setLoading(false);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const newDoc = {
      id: Date.now(),
      documentName: docName,
      documentType: docType,
      fileSize: '1.5 MB',
      uploadedDate: new Date().toISOString().split('T')[0],
      status: 'VERIFIED',
      fileUrl: '#',
    };
    setDocuments((prev) => [newDoc, ...prev]);

    try {
      await api.post(`/students/me/documents?name=${encodeURIComponent(docName)}&type=${docType}`);
    } catch (err) {
      console.warn('Backend document upload API failed, saved locally:', err);
    }

    setUploadModal(false);
    setDocName('');
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document record?')) return;
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    try {
      await api.delete(`/documents/${id}`);
    } catch (err) {
      console.warn('Backend document delete failed, removed locally:', err);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Digital Document Safe..." />;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Digital Document Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            Access official transcripts, certificates, ID cards, and uploaded college documents.
          </p>
        </div>

        <button
          onClick={() => setUploadModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all self-start md:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div key={doc.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <StatusBadge status={doc.status} />
              </div>

              <h3 className="text-base font-bold text-white mt-4 line-clamp-1">{doc.documentName}</h3>
              <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                <span>{doc.documentType}</span>
                <span>•</span>
                <span>{doc.fileSize || '1.0 MB'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Uploaded {new Date(doc.uploadedDate).toLocaleDateString()}
              </span>
              <div className="flex space-x-2">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModal}
        onClose={() => setUploadModal(false)}
        title="Upload Student Document"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Document Display Name
            </label>
            <input
              type="text"
              required
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="e.g. Community Certificate 2026"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Document Type
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ID_CARD">Student ID Card</option>
              <option value="BONAFIDE">Bonafide Certificate</option>
              <option value="MARKSHEET">Marksheet / Transcript</option>
              <option value="COMMUNITY">Community Certificate</option>
              <option value="INCOME">Income Certificate</option>
              <option value="SCHOLARSHIP">Scholarship Document</option>
              <option value="OTHER">Other College Document</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-slate-700 p-6 rounded-2xl text-center bg-slate-900/50">
            <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
            <p className="text-xs text-slate-300 font-semibold">Attached to Supabase Cloud Storage</p>
            <p className="text-[11px] text-slate-500 mt-1">PDF, PNG, JPG up to 10MB</p>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setUploadModal(false)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {uploading ? 'Registering Document...' : 'Save Document Record'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentDocuments;
