/**
 * Utilitários para formatação e cálculo amigável de prazos em pt-BR
 */

export function formatDateBR(dateString: string): string {
  if (!dateString) return 'Sem prazo';
  try {
    // Normaliza datas YYYY-MM-DD
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(date);
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export interface DeadlineIndicator {
  text: string;
  badgeClass: string;
  isUrgent: boolean;
  isOverdue: boolean;
}

export function getDeadlineIndicator(deadlineString: string, isCompleted: boolean): DeadlineIndicator {
  if (isCompleted) {
    return {
      text: 'Concluído',
      badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      isUrgent: false,
      isOverdue: false,
    };
  }

  if (!deadlineString) {
    return {
      text: 'Sem data',
      badgeClass: 'text-slate-600 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      isUrgent: false,
      isOverdue: false,
    };
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parts = deadlineString.split('-');
    let targetDate: Date;
    if (parts.length === 3) {
      targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      targetDate = new Date(deadlineString);
      targetDate.setHours(0, 0, 0, 0);
    }

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const overdueDays = Math.abs(diffDays);
      return {
        text: overdueDays === 1 ? 'Vencido ontem' : `Vencido há ${overdueDays} dias`,
        badgeClass: 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
        isUrgent: true,
        isOverdue: true,
      };
    } else if (diffDays === 0) {
      return {
        text: 'Vence hoje!',
        badgeClass: 'text-amber-800 bg-amber-100 border-amber-300 animate-pulse dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-700',
        isUrgent: true,
        isOverdue: false,
      };
    } else if (diffDays === 1) {
      return {
        text: 'Vence amanhã',
        badgeClass: 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800',
        isUrgent: true,
        isOverdue: false,
      };
    } else if (diffDays <= 5) {
      return {
        text: `Faltam ${diffDays} dias`,
        badgeClass: 'text-sky-700 bg-sky-50 border-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-800',
        isUrgent: false,
        isOverdue: false,
      };
    } else {
      return {
        text: `Em ${diffDays} dias`,
        badgeClass: 'text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        isUrgent: false,
        isOverdue: false,
      };
    }
  } catch {
    return {
      text: 'Prazo definido',
      badgeClass: 'text-slate-600 bg-slate-100 border-slate-200',
      isUrgent: false,
      isOverdue: false,
    };
  }
}
