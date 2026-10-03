import React, { useRef } from 'react';
import { X, Printer, Download, FileSpreadsheet } from 'lucide-react';
import { DocumentHeader } from './DocumentHeader';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subTitle?: string;
  children: React.ReactNode;
  onExportExcel?: () => void;
  landscape?: boolean;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  title,
  subTitle,
  children,
  onExportExcel,
  landscape = false,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className={`relative bg-slate-900 border border-slate-700 rounded-2xl w-full ${landscape ? 'max-w-6xl' : 'max-w-4xl'} my-8 shadow-2xl flex flex-col max-h-[92vh]`}>
        {/* Top Modal Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 rounded-t-2xl no-print">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Printer className="w-4 h-4 text-blue-400" />
              <span>Pratinjau Dokumen Siap Cetak (A4 / F4)</span>
            </h2>
            <p className="text-xs text-slate-400">{title} — Sesuai Format Administrasi Guru Indonesia</p>
          </div>

          <div className="flex items-center gap-2">
            {onExportExcel && (
              <button
                onClick={onExportExcel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-semibold transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ekspor Excel (.xlsx)</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-800/50 flex justify-center">
          <div
            ref={contentRef}
            className={`bg-white text-slate-900 p-8 sm:p-12 shadow-xl rounded-sm w-full ${landscape ? 'max-w-5xl' : 'max-w-3xl'} print:shadow-none print:p-0 print:max-w-none`}
          >
            <DocumentHeader title={title} subTitle={subTitle}>
              {children}
            </DocumentHeader>
          </div>
        </div>

        {/* Bottom Hint */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/60 rounded-b-2xl text-[11px] text-slate-400 flex items-center justify-between no-print">
          <span>*Tips: Pada jendela cetak peramban, pilih opsi <strong>"Simpan sebagai PDF"</strong> atau printer fisik Anda.</span>
          <button
            onClick={onClose}
            className="text-xs text-slate-300 hover:text-white font-medium"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  );
};
