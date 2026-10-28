import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { StudyObjective } from '../types/studyObjective';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  objective: StudyObjective | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  objective,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !objective) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-delete-title"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="flex items-start justify-between p-5 pb-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="px-5 pb-5">
          <h3
            id="modal-delete-title"
            className="text-lg font-bold text-slate-900 mb-2 leading-tight"
          >
            Confirmar exclusão de objetivo
          </h3>

          <p className="text-sm text-slate-600 mb-3 leading-relaxed">
            Você tem certeza de que deseja excluir este objetivo de estudo?
          </p>

          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 mb-5">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Objetivo selecionado:
            </span>
            <p className="text-sm font-semibold text-slate-800 break-words">
              {objective.title}
            </p>
          </div>

          <p className="text-xs text-rose-600 font-medium bg-rose-50/80 p-2.5 rounded-lg border border-rose-100">
            ⚠️ Essa ação não poderá ser desfeita.
          </p>
        </div>

        {/* Ações */}
        <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200/70 active:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-xs shadow-rose-600/20 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Sim, Excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
