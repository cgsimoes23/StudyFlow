import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ObjectiveStatus } from '../types/studyObjective';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortBy: 'deadline' | 'recent' | 'alphabetical';
  onSortChange: (sort: 'deadline' | 'recent' | 'alphabetical') => void;
  totalFiltered: number;
  totalAll: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  totalFiltered,
  totalAll,
}) => {
  const statusOptions: { value: string; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'not_started', label: 'Não iniciados' },
    { value: 'in_progress', label: 'Em andamento' },
    { value: 'completed', label: 'Concluídos' },
  ];

  const hasActiveFilters = searchQuery.trim() !== '' || statusFilter !== 'all';

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-4 mb-6 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
      {/* Barra de Pesquisa */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Pesquisar por título ou descrição..."
          className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
            title="Limpar pesquisa"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filtros de Status (Pílulas / Abas) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onStatusFilterChange(opt.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === opt.value
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-800'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Ordenação */}
      <div className="flex items-center gap-2 justify-between md:justify-end border-t md:border-t-0 pt-2.5 md:pt-0 border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ordenar:</span>
        </div>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as any)}
          aria-label="Critério de ordenação dos objetivos"
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
        >
          <option value="deadline">Prazo mais próximo</option>
          <option value="recent">Adicionados recentemente</option>
          <option value="alphabetical">Ordem alfabética (A-Z)</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={() => {
              onSearchChange('');
              onStatusFilterChange('all');
            }}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-2 ml-1 cursor-pointer"
          >
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  );
};
