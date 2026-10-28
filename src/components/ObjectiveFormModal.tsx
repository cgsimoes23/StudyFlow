import React, { useState, useEffect } from 'react';
import { X, Calendar, CheckCircle2, Clock, Hourglass, Sparkles } from 'lucide-react';
import { ObjectiveFormData, ObjectiveStatus, STATUS_MAP, StudyObjective } from '../types/studyObjective';

interface ObjectiveFormModalProps {
  isOpen: boolean;
  editingObjective: StudyObjective | null;
  onSave: (data: ObjectiveFormData) => void;
  onClose: () => void;
}

export const ObjectiveFormModal: React.FC<ObjectiveFormModalProps> = ({
  isOpen,
  editingObjective,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<ObjectiveStatus>('not_started');

  const [errors, setErrors] = useState<{ title?: string; deadline?: string }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Inicializa o formulário ao abrir ou alterar o objetivo em edição
  useEffect(() => {
    if (editingObjective) {
      setTitle(editingObjective.title);
      setDescription(editingObjective.description);
      setDeadline(editingObjective.deadline);
      setStatus(editingObjective.status);
    } else {
      // Valor padrão para novo cadastro: prazo em 7 dias
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      const defaultDateString = defaultDate.toISOString().split('T')[0];

      setTitle('');
      setDescription('');
      setDeadline(defaultDateString);
      setStatus('not_started');
    }
    setErrors({});
    setHasSubmitted(false);
  }, [editingObjective, isOpen]);

  // Atalho de tecla Escape para fechar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const validate = (): boolean => {
    const newErrors: { title?: string; deadline?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Por favor, informe o título do seu objetivo de estudo.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'O título deve ter pelo menos 3 caracteres.';
    }

    if (!deadline) {
      newErrors.deadline = 'Defina um prazo estimado para orientar seu ritmo.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (!validate()) {
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
    });
  };

  // Atalhos de prazo para estudantes iniciantes
  const applyQuickDeadline = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setDeadline(d.toISOString().split('T')[0]);
    if (errors.deadline) {
      setErrors((prev) => ({ ...prev, deadline: undefined }));
    }
  };

  if (!isOpen) return null;

  const isEditing = Boolean(editingObjective);

  const statusOptions: {
    value: ObjectiveStatus;
    label: string;
    icon: React.ReactNode;
    description: string;
  }[] = [
    {
      value: 'not_started',
      label: 'Não iniciado',
      icon: <Hourglass className="w-4 h-4 text-amber-600" />,
      description: 'Planejado para começar em breve',
    },
    {
      value: 'in_progress',
      label: 'Em andamento',
      icon: <Clock className="w-4 h-4 text-blue-600" />,
      description: 'Estudos já em andamento ativo',
    },
    {
      value: 'completed',
      label: 'Concluído',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      description: 'Meta atingida e revisada',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-modal-title"
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div>
            <h2 id="form-modal-title" className="text-lg font-bold text-slate-900">
              {isEditing ? 'Editar Objetivo de Estudo' : 'Cadastrar Novo Objetivo'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEditing
                ? 'Atualize os dados e acompanhe sua evolução.'
                : 'Defina o que você quer aprender com clareza e sem complicação.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            {/* Campo: Título */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="objective-title" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Título do Objetivo <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">{title.length}/100</span>
              </div>
              <input
                id="objective-title"
                type="text"
                maxLength={100}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (hasSubmitted && errors.title) {
                    setErrors((prev) => ({ ...prev, title: undefined }));
                  }
                }}
                placeholder="Ex: Aprender funções assíncronas em JavaScript"
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition-all ${
                  errors.title
                    ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
              {errors.title && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <span>•</span> {errors.title}
                </p>
              )}
            </div>

            {/* Campo: Descrição */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="objective-desc" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Descrição ou Anotações <span className="text-slate-400 font-normal lowercase">(opcional)</span>
                </label>
                <span className="text-[11px] text-slate-400">{description.length}/300</span>
              </div>
              <textarea
                id="objective-desc"
                rows={3}
                maxLength={300}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Assistir aulas 4 a 6 do curso e resolver 3 exercícios no caderno."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              />
            </div>

            {/* Campo: Prazo */}
            <div>
              <label htmlFor="objective-deadline" className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                Prazo Limite <span className="text-rose-500">*</span>
              </label>

              <div className="relative">
                <input
                  id="objective-deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => {
                    setDeadline(e.target.value);
                    if (hasSubmitted && errors.deadline) {
                      setErrors((prev) => ({ ...prev, deadline: undefined }));
                    }
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 transition-all ${
                    errors.deadline
                      ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'
                  }`}
                />
              </div>

              {/* Sugestões rápidas de prazo */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-[11px] text-slate-400">Atalhos rápidos:</span>
                <button
                  type="button"
                  onClick={() => applyQuickDeadline(1)}
                  className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Amanhã
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickDeadline(3)}
                  className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  +3 dias
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickDeadline(7)}
                  className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  1 semana
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickDeadline(15)}
                  className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  15 dias
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickDeadline(30)}
                  className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  1 mês
                </button>
              </div>

              {errors.deadline && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <span>•</span> {errors.deadline}
                </p>
              )}
            </div>

            {/* Campo: Status */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
                Status Atual <span className="text-rose-500">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {statusOptions.map((opt) => {
                  const isSelected = status === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setStatus(opt.value)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {opt.icon}
                        <span
                          className={`text-xs font-bold ${
                            isSelected ? 'text-indigo-950' : 'text-slate-800'
                          }`}
                        >
                          {opt.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 leading-tight">
                        {opt.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Rodapé com Ações */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200/60 active:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm shadow-indigo-600/25 transition-all cursor-pointer"
            >
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
