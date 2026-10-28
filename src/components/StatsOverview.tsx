import React from 'react';
import { Target, Clock, Hourglass, CheckCircle2 } from 'lucide-react';
import { StudyObjective } from '../types/studyObjective';

interface StatsOverviewProps {
  objectives: StudyObjective[];
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  objectives,
  activeFilter,
  onSelectFilter,
}) => {
  const total = objectives.length;
  const notStarted = objectives.filter((item) => item.status === 'not_started').length;
  const inProgress = objectives.filter((item) => item.status === 'in_progress').length;
  const completed = objectives.filter((item) => item.status === 'completed').length;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="mb-8" aria-label="Resumo dos Objetivos">
      {/* Banner de progresso acolhedor */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-indigo-950/10 mb-5 relative overflow-hidden">
        {/* Detalhe de fundo decorativo */}
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200 bg-indigo-800/80 px-2.5 py-0.5 rounded-full border border-indigo-700">
                Seu Painel de Aprendizado
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {total === 0
                ? 'Comece sua jornada de estudos hoje!'
                : percentage === 100
                ? 'Parabéns! Todos os objetivos foram concluídos! 🏆'
                : `Você completou ${percentage}% dos seus objetivos`}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-xl">
              {total === 0
                ? 'Defina metas curtas e realistas para construir o hábito de aprender de forma consistente.'
                : percentage === 100
                ? 'Excelente dedicação. Que tal planejar novas metas para continuar evoluindo?'
                : `Mantenha o ritmo! Cada etapa concluída constrói a base do seu conhecimento.`}
            </p>
          </div>

          {/* Barra de Progresso Circular ou Linear */}
          <div className="flex flex-col sm:items-end justify-center min-w-[180px] bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
            <div className="flex items-baseline justify-between w-full sm:justify-end gap-2 mb-1.5">
              <span className="text-xs text-indigo-200">Progresso Geral</span>
              <span className="text-lg font-bold text-sky-300">{percentage}%</span>
            </div>
            <div className="w-full bg-slate-700/60 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-sky-400 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-[11px] text-indigo-200/80 mt-1.5">
              {completed} de {total} {total === 1 ? 'objetivo concluído' : 'objetivos concluídos'}
            </span>
          </div>
        </div>
      </div>

      {/* Cartões de Contadores Rápidos (Clicáveis como Filtros) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Cadastrado */}
        <button
          type="button"
          onClick={() => onSelectFilter('all')}
          className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-indigo-50/90 border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-slate-800 leading-tight">
              {total}
            </div>
            <div className="text-xs font-medium text-slate-500">
              {total === 1 ? 'Objetivo cadastrado' : 'Objetivos cadastrados'}
            </div>
          </div>
        </button>

        {/* Não Iniciados */}
        <button
          type="button"
          onClick={() => onSelectFilter('not_started')}
          className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'not_started'
              ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Hourglass className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-amber-900 leading-tight">
              {notStarted}
            </div>
            <div className="text-xs font-medium text-slate-500">
              Não iniciados
            </div>
          </div>
        </button>

        {/* Em Andamento */}
        <button
          type="button"
          onClick={() => onSelectFilter('in_progress')}
          className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'in_progress'
              ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-blue-900 leading-tight">
              {inProgress}
            </div>
            <div className="text-xs font-medium text-slate-500">
              Em andamento
            </div>
          </div>
        </button>

        {/* Concluídos */}
        <button
          type="button"
          onClick={() => onSelectFilter('completed')}
          className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'completed'
              ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-emerald-900 leading-tight">
              {completed}
            </div>
            <div className="text-xs font-medium text-slate-500">
              Concluídos
            </div>
          </div>
        </button>
      </div>
    </section>
  );
};
