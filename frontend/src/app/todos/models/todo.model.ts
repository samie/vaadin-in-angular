export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  dueDate: string | null;
}

export type Filter = 'all' | 'active' | 'completed';
