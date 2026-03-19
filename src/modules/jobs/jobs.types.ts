export type JobStatus = 'pending' | 'processing' | 'success' | 'failed';

export interface Job {
  id: number;
  pipeline_id: number;
  payload: any;
  status: JobStatus;
  attempts: number;
  created_at: string;
  last_attempt: string | null;
}