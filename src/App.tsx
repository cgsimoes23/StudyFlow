/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ObjectiveFormData, ObjectiveStatus, StudyObjective } from './types/studyObjective';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { FilterBar } from './components/FilterBar';
import { ObjectiveCard } from './components/ObjectiveCard';
import { EmptyState } from './components/EmptyState';
import { ObjectiveFormModal } from './components/ObjectiveFormModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { NotificationToast, ToastMessage } from './components/NotificationToast';
import { Heart, Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  // Estado dos objetivos carregados do localStorage
  const [objectives, setObjectives] = useState<StudyObjective[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Filtros e ordenação
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'recent' | 'alphabetical'>('deadline');

  // Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<StudyObjective | null>(null);
  const [deletingObjective, setDeletingObjective] = useState<StudyObjective | null>(null);

  // Notificações Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({
      id: String(Date.now()),
      type,
      message,
    });
  };

  // Carrega os dados do localStorage ao iniciar
  useEffect(() => {
    const loaded = storageService.getObjectives();
    setObjectives(loaded);
    setIsLoaded(true);
  }, []);

  // Handler para criar ou atualizar objetivo
  const handleSaveObjective = (formData: ObjectiveFormData) => {
    if (editingObjective) {
      const updated = storageService.updateObjective(editingObjective.id, formData);
      if (updated) {
        setObjectives((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        showToast('Objetivo de estudo atualizado com sucesso!', 'success');
      }
    } else {
      const created = storageService.createObjective(formData);
      setObjectives((prev) => [created, ...prev]);
      showToast('Novo objetivo cadastrado com sucesso!', 'success');
    }

    setIsFormModalOpen(false);
    setEditingObjective(null);
  };

  // Handler para transição rápida de status diretamente no card
  const handleStatusChange = (id: string, newStatus: ObjectiveStatus) => {
    const updated = storageService.updateStatus(id, newStatus);
    if (updated) {
      setObjectives((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );

      const statusLabels: Record<ObjectiveStatus, string> = {
        not_started: 'reaberto como "Não iniciado"',
        in_progress: 'movido para "Em andamento"',
        completed: 'marcado como "Concluído"! 🎉',
      };
      showToast(`Objetivo ${statusLabels[newStatus]}`, 'info');
    }
  };

  // Handler para confirmar exclusão
  const handleConfirmDelete = () => {
    if (!deletingObjective) return;

    const idToDelete = deletingObjective.id;
    const title = deletingObjective.title;
    const success = storageService.deleteObjective(idToDelete);

    if (success) {
      setObjectives((prev) => prev.filter((item) => item.id !== idToDelete));
      showToast(`Objetivo "${title}" excluído.`, 'info');
    }
    setDeletingObjective(null);
  };

  // Abrir modal para novo cadastro
  const handleOpenCreateModal = () => {
    setEditingObjective(null);
    setIsFormModalOpen(true);
  };

  // Abrir modal para edição
  const handleOpenEditModal = (obj: StudyObjective) => {
    setEditingObjective(obj);
    setIsFormModalOpen(true);
  };

  // Carregar exemplos de objetivos
  const handleLoadSamples = () => {
    const samples = storageService.loadSampleObjectives();
    setObjectives(samples);
    showToast('Exemplos de estudo carregados com sucesso!', 'success');
  };

  // Filtragem e ordenação dos objetivos
  const filteredObjectives = useMemo(() => {
    return objectives
      .filter((item) => {
        // Filtro por status
        if (statusFilter !== 'all' && item.status !== statusFilter) {
          return false;
        }

        // Filtro por texto (título ou descrição)
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(query);
          const matchDesc = item.description?.toLowerCase().includes(query);
          return matchTitle || matchDesc;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          // Prazos mais próximos primeiro; sem prazo por último
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return a.deadline.localeCompare(b.deadline);
        } else if (sortBy === 'recent') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === 'alphabetical') {
          return a.title.localeCompare(b.title, 'pt-BR');
        }
        return 0;
      });
  }, [objectives, statusFilter, searchQuery, sortBy]);

  const hasAnyObjectives = objectives.length > 0;
  const isSearchOrFilterActive = searchQuery.trim() !== '' || statusFilter !== 'all';

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-600">Carregando seu fluxo de estudos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Cabeçalho */}
      <Header
        onOpenNewModal={handleOpenCreateModal}
        onLoadSamples={handleLoadSamples}
        hasItems={hasAnyObjectives}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Painel de Métricas e Quantidade de Objetivos */}
        <StatsOverview
          objectives={objectives}
          activeFilter={statusFilter}
          onSelectFilter={(filter) => setStatusFilter(filter)}
        />

        {/* Barra de Filtros e Busca (Exibida quando há objetivos cadastrados) */}
        {hasAnyObjectives && (
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalFiltered={filteredObjectives.length}
            totalAll={objectives.length}
          />
        )}

        {/* Listagem de Objetivos */}
        {filteredObjectives.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <span>Objetivos de Estudo</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {filteredObjectives.length} {filteredObjectives.length === 1 ? 'item' : 'itens'}
                </span>
              </h3>
              {isSearchOrFilterActive && (
                <span className="text-xs text-slate-500">
                  Mostrando {filteredObjectives.length} de {objectives.length}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredObjectives.map((obj) => (
                <ObjectiveCard
                  key={obj.id}
                  objective={obj}
                  onEdit={handleOpenEditModal}
                  onDeleteRequest={setDeletingObjective}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            isFiltered={isSearchOrFilterActive && hasAnyObjectives}
            onOpenNewModal={handleOpenCreateModal}
            onClearFilter={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
            onLoadSamples={handleLoadSamples}
          />
        )}

        {/* Dicas Pedagógicas Acolhedoras para o Estudante */}
        <section className="mt-12 pt-8 border-t border-slate-200/80">
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-indigo-950">
                  Dica StudyFlow para Iniciantes
                </h4>
                <p className="text-xs text-indigo-800/90 mt-0.5 max-w-2xl leading-relaxed">
                  Divida grandes temas em metas pequenas com prazos de 3 a 7 dias. Celebrar pequenas vitórias fortalece a confiança e evita o desânimo!
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-white hover:bg-indigo-50 px-3.5 py-2 rounded-lg border border-indigo-200 transition-colors shrink-0 shadow-2xs cursor-pointer"
            >
              + Adicionar meta agora
            </button>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <div className="flex items-center gap-1.5 justify-center">
            <span>StudyFlow</span>
            <span>•</span>
            <span>Organizador de Objetivos de Aprendizado</span>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <span>Feito com carinho para impulsionar seus estudos</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </footer>

      {/* Modal de Cadastro e Edição */}
      <ObjectiveFormModal
        isOpen={isFormModalOpen}
        editingObjective={editingObjective}
        onSave={handleSaveObjective}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingObjective(null);
        }}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDeleteModal
        isOpen={Boolean(deletingObjective)}
        objective={deletingObjective}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingObjective(null)}
      />

      {/* Notificação Toast */}
      <NotificationToast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
