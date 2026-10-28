import React from 'react';
import { BookOpenCheck, Plus, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenNewModal: () => void;
  onLoadSamples?: () => void;
  hasItems: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewModal, onLoadSamples, hasItems }) => {
  return (
    <header className="border-b border-indigo-100/80 bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Marca & Identidade */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 ring-4 ring-indigo-50">
            <BookOpenCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Study<span className="text-indigo-600">Flow</span>
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                Iniciante
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Organize seus passos de aprendizado no seu próprio ritmo
            </p>
          </div>
        </div>

        {/* Ações do Topo */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {onLoadSamples && !hasItems && (
            <button
              onClick={onLoadSamples}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Carregar exemplos para inspirar"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Ver Exemplos</span>
            </button>
          )}

          <button
            onClick={onOpenNewModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm shadow-indigo-600/25 transition-all hover:shadow-md hover:shadow-indigo-600/30 active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Novo Objetivo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
