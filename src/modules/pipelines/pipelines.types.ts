export type ActionType = 'log' | 'uppercase' | 'reverse';

export interface Pipeline {
  id: number;
  name: string;
  action_type: ActionType;
  created_at: string;
}