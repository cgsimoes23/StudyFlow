export type ObjectiveStatus = 'not_started' | 'in_progress' | 'completed';

export interface StudyObjective {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO date string or YYYY-MM-DD
  status: ObjectiveStatus;
  createdAt: string;
  updatedAt: string;
}

export type ObjectiveFormData = {
  title: string;
  description: string;
  deadline: string;
  status: ObjectiveStatus;
};

export interface StatusMeta {
  label: string;
  badgeClass: string;
  dotClass: string;
  bgLightClass: string;
  borderClass: string;
  textClass: string;
}

export const STATUS_MAP: Record<ObjectiveStatus, StatusMeta> = {
  not_started: {
    label: 'Não iniciado',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    dotClass: 'bg-amber-500',
    bgLightClass: 'bg-amber-500/10',
    borderClass: 'border-amber-300',
    textClass: 'text-amber-700',
  },
  in_progress: {
    label: 'Em andamento',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60',
    dotClass: 'bg-blue-500',
    bgLightClass: 'bg-blue-500/10',
    borderClass: 'border-blue-300',
    textClass: 'text-blue-700',
  },
  completed: {
    label: 'Concluído',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    dotClass: 'bg-emerald-500',
    bgLightClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-300',
    textClass: 'text-emerald-700',
  },
};
