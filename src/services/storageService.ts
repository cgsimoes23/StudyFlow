import { ObjectiveFormData, StudyObjective } from '../types/studyObjective';

const STORAGE_KEY = 'studyflow_objectives_v1';
const INITIAL_SETUP_FLAG = 'studyflow_seeded_v1';

// Exemplos iniciais acolhedores para estudantes iniciantes
export const INITIAL_SAMPLE_OBJECTIVES: StudyObjective[] = [
  {
    id: 'sample-1',
    title: 'Dominar Lógica de Programação Básica',
    description: 'Estudar variáveis, estruturas condicionais (if/else) e laços de repetição (for/while) resolvendo 5 exercícios práticos.',
    deadline: getFutureDate(7),
    status: 'in_progress',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Vocabulário Essencial de Inglês Técnico',
    description: 'Praticar 15 novos termos técnicos diariamente utilizando flashcards e anotando frases contextuais.',
    deadline: getFutureDate(14),
    status: 'not_started',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Resumo e Mapa Mental: Gestão de Tempo Pomodoro',
    description: 'Compreender os princípios da técnica Pomodoro e testar ciclos de 25 minutos de foco por 5 minutos de pausa.',
    deadline: getFutureDate(2),
    status: 'completed',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function getFutureDate(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
}

export const storageService = {
  /**
   * Obtém todos os objetivos salvos no localStorage.
   * Se for o primeiro acesso, inicializa com exemplos acolhedores.
   */
  getObjectives(): StudyObjective[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const isSeeded = localStorage.getItem(INITIAL_SETUP_FLAG);

      if (!data && !isSeeded) {
        // Primeiro acesso: semeia dados de exemplo para orientar o estudante
        this.saveObjectives(INITIAL_SAMPLE_OBJECTIVES);
        localStorage.setItem(INITIAL_SETUP_FLAG, 'true');
        return INITIAL_SAMPLE_OBJECTIVES;
      }

      if (!data) {
        return [];
      }

      return JSON.parse(data) as StudyObjective[];
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista completa no localStorage.
   */
  saveObjectives(objectives: StudyObjective[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(objectives));
      // Garante que a flag de primeiro acesso seja marcada
      localStorage.setItem(INITIAL_SETUP_FLAG, 'true');
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Cria um novo objetivo e persiste.
   */
  createObjective(formData: ObjectiveFormData): StudyObjective {
    const currentList = this.getObjectives();
    const newObjective: StudyObjective = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `obj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      deadline: formData.deadline,
      status: formData.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedList = [newObjective, ...currentList];
    this.saveObjectives(updatedList);
    return newObjective;
  },

  /**
   * Atualiza um objetivo existente.
   */
  updateObjective(id: string, formData: ObjectiveFormData): StudyObjective | null {
    const currentList = this.getObjectives();
    const index = currentList.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updatedObjective: StudyObjective = {
      ...currentList[index],
      title: formData.title.trim(),
      description: formData.description.trim(),
      deadline: formData.deadline,
      status: formData.status,
      updatedAt: new Date().toISOString(),
    };

    currentList[index] = updatedObjective;
    this.saveObjectives(currentList);
    return updatedObjective;
  },

  /**
   * Atualiza unicamente o status de um objetivo (para ações rápidas nos cartões).
   */
  updateStatus(id: string, newStatus: StudyObjective['status']): StudyObjective | null {
    const currentList = this.getObjectives();
    const target = currentList.find((item) => item.id === id);
    if (!target) return null;

    return this.updateObjective(id, {
      title: target.title,
      description: target.description,
      deadline: target.deadline,
      status: newStatus,
    });
  },

  /**
   * Exclui um objetivo pelo ID.
   */
  deleteObjective(id: string): boolean {
    const currentList = this.getObjectives();
    const filtered = currentList.filter((item) => item.id !== id);
    if (filtered.length === currentList.length) {
      return false;
    }
    this.saveObjectives(filtered);
    return true;
  },

  /**
   * Reseta e reabastece com os exemplos iniciais.
   */
  loadSampleObjectives(): StudyObjective[] {
    this.saveObjectives(INITIAL_SAMPLE_OBJECTIVES);
    return INITIAL_SAMPLE_OBJECTIVES;
  },

  /**
   * Limpa todos os objetivos salvos.
   */
  clearAllObjectives(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(INITIAL_SETUP_FLAG, 'true');
  },
};
