import { apiClient } from './client';
import { Inference, InferenceFormData, InferenceResult, InferenceFilterOptions } from '../types/inference';

/**
 * 推論API
 */
export const inferencesApi = {
  // 推論一覧の取得
  getInferences: async (filters?: InferenceFilterOptions): Promise<Inference[]> => {
    return apiClient.get<Inference[]>('/inferences', { params: filters });
  },

  // 特定の推論の取得
  getInference: async (id: string): Promise<Inference> => {
    return apiClient.get<Inference>(`/inferences/${id}`);
  },

  // 推論の作成
  createInference: async (data: InferenceFormData): Promise<Inference> => {
    return apiClient.post<Inference>('/inferences', data);
  },

  // 推論の更新
  updateInference: async (id: string, data: Partial<InferenceFormData>): Promise<Inference> => {
    return apiClient.put<Inference>(`/inferences/${id}`, data);
  },

  // 推論の削除
  deleteInference: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/inferences/${id}`);
  },

  // 推論の実行
  runInference: async (id: string): Promise<Inference> => {
    return apiClient.post<Inference>(`/inferences/${id}/run`);
  },

  // 推論の停止
  stopInference: async (id: string): Promise<Inference> => {
    return apiClient.post<Inference>(`/inferences/${id}/stop`);
  },

  // 推論結果の取得
  getInferenceResults: async (inferenceId: string): Promise<InferenceResult[]> => {
    return apiClient.get<InferenceResult[]>(`/inferences/${inferenceId}/results`);
  },

  // 特定の推論結果の取得
  getInferenceResult: async (inferenceId: string, resultId: string): Promise<InferenceResult> => {
    return apiClient.get<InferenceResult>(`/inferences/${inferenceId}/results/${resultId}`);
  },

  // 推論結果のエクスポート（CSVファイル）
  exportInferenceResults: async (id: string): Promise<Blob> => {
    return apiClient.get<Blob>(`/inferences/${id}/export`, {
      responseType: 'blob',
    });
  },
};
