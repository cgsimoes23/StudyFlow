import React from 'react';
import { BookOpen, Plus, SearchX, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onOpenNewModal: () => void;
  onClearFilter?: () => void;
  onLoadSamples?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onOpenNewModal,
  onClearFilter,
  onLoadSamples,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto my-6 shadow-xs">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
          <SearchX className="w-7 h-7 stroke-[1.8]" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-5 leading-relaxed">
          Não localizamos nenhum objetivo com os termos de busca ou filtros selecionados.
        </p>
        {onClearFilter && (
          <button
            onClick={onClearFilter}
            className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
          >
            Limpar filtros e ver todos
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-dashed border-indigo-200/90 p-8 sm:p-12 text-center max-w-lg mx-auto my-8 shadow-xs">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-500/10 to-sky-500/20 text-indigo-600 flex items-center justify-center mb-4 ring-8 ring-indigo-50/50">
        <BookOpen className="w-8 h-8 stroke-[2]" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-1.5">
        Seu fluxo de estudos está pronto para começar!
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed max-w-md mx-auto">
        Você ainda não cadastrou nenhum objetivo. Pequenas metas diárias ou semanais ajudam a criar um hábito de estudo consistente e sem ansiedade.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onOpenNewModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar Primeiro Objetivo</span>
        </button>

        {onLoadSamples && (
          <button
            onClick={onLoadSamples}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Ver Exemplos Prontos</span>
          </button>
        )}
      </div>
    </div>
  );
};
