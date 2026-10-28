import React from 'react';
import { Calendar, Pencil, Trash2, CheckCircle2, Circle, ArrowRightCircle } from 'lucide-react';
import { ObjectiveStatus, STATUS_MAP, StudyObjective } from '../types/studyObjective';
import { formatDateBR, getDeadlineIndicator } from '../utils/dateUtils';

interface ObjectiveCardProps {
  objective: StudyObjective;
  onEdit: (objective: StudyObjective) => void;
  onDeleteRequest: (objective: StudyObjective) => void;
  onStatusChange: (id: string, newStatus: ObjectiveStatus) => void;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  onEdit,
  onDeleteRequest,
  onStatusChange,
}) => {
  const statusMeta = STATUS_MAP[objective.status];
  const isCompleted = objective.status === 'completed';
  const deadlineInfo = getDeadlineIndicator(objective.deadline, isCompleted);

  // Ciclo rápido de transição com 1 clique para praticidade do estudante
  const getNextStatus = (current: ObjectiveStatus): ObjectiveStatus => {
    if (current === 'not_started') return 'in_progress';
    if (current === 'in_progress') return 'completed';
    return 'not_started';
  };

  const getQuickActionLabel = (current: ObjectiveStatus): string => {
    if (current === 'not_started') return 'Iniciar agora';
    if (current === 'in_progress') return 'Marcar como concluído';
    return 'Reabrir objetivo';
  };

  return (
    <div
      className={`group relative bg-white rounded-xl border transition-all duration-200 flex flex-col justify-between ${
        isCompleted
          ? 'border-emerald-200/80 bg-slate-50/40 shadow-xs'
          : 'border-slate-200 hover:border-indigo-300 hover:shadow-md shadow-xs'
      }`}
    >
      <div className="p-5">
        {/* Topo do Card: Badge de Status e Indicador de Prazo */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Badge de Status */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusMeta.badgeClass}`}
          >
            <span className={`w-2 h-2 rounded-full ${statusMeta.dotClass}`} />
            {statusMeta.label}
          </span>

          {/* Indicador Temporal */}
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${deadlineInfo.badgeClass}`}
            title={`Prazo final: ${formatDateBR(objective.deadline)}`}
          >
            {deadlineInfo.text}
          </span>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base font-bold tracking-tight mb-2 leading-snug break-words ${
            isCompleted
              ? 'text-slate-500 line-through decoration-slate-400 decoration-1'
              : 'text-slate-900 group-hover:text-indigo-950'
          }`}
        >
          {objective.title}
        </h3>

        {/* Descrição */}
        {objective.description ? (
          <p
            className={`text-xs sm:text-sm leading-relaxed mb-4 whitespace-pre-line line-clamp-3 ${
              isCompleted ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {objective.description}
          </p>
        ) : (
          <p className="text-xs italic text-slate-400 mb-4">
            Sem descrição complementar
          </p>
        )}

        {/* Informação de Data/Prazo */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span>Prazo: {formatDateBR(objective.deadline)}</span>
        </div>
      </div>

      {/* Rodapé do Card com Ações */}
      <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 rounded-b-xl flex items-center justify-between gap-2">
        {/* Ação rápida de avanço de status */}
        <button
          type="button"
          onClick={() => onStatusChange(objective.id, getNextStatus(objective.status))}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors px-2 py-1 rounded-md cursor-pointer ${
            isCompleted
              ? 'text-slate-600 hover:text-indigo-700 hover:bg-white'
              : objective.status === 'in_progress'
              ? 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50'
              : 'text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50'
          }`}
          title={getQuickActionLabel(objective.status)}
        >
          {isCompleted ? (
            <Circle className="w-3.5 h-3.5" />
          ) : objective.status === 'in_progress' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <ArrowRightCircle className="w-3.5 h-3.5 text-indigo-600" />
          )}
          <span className="hidden sm:inline">{getQuickActionLabel(objective.status)}</span>
          <span className="sm:hidden">{isCompleted ? 'Reabrir' : 'Avançar'}</span>
        </button>

        {/* Botões Editar e Excluir */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(objective)}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
            title="Editar objetivo"
            aria-label={`Editar ${objective.title}`}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDeleteRequest(objective)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
            title="Excluir objetivo"
            aria-label={`Excluir ${objective.title}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
