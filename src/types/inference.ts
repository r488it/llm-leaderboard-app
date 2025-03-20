/**
 * 推論実行の型定義
 */

export type InferenceStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface Inference {
  id: string;
  name: string;
  description?: string;
  datasetId: string;
  providerId: string;
  modelId: string;
  status: InferenceStatus;
  progress: number; // 0-100
  results: InferenceResult[];
  metrics?: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface InferenceResult {
  id: string;
  datasetItemId: string;
  input: string;
  expectedOutput?: string;
  actualOutput: string;
  metrics?: Record<string, number>;
  metadata?: Record<string, any>;
  error?: string;
  latency?: number; // ミリ秒
  tokenCount?: number;
}

export interface InferenceFormData {
  name: string;
  description?: string;
  datasetId: string;
  providerId: string;
  modelId: string;
}

export interface InferenceFilterOptions {
  datasetId?: string;
  providerId?: string;
  modelId?: string;
  status?: InferenceStatus;
}
