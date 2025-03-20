import { apiClient } from './client';
import { Dataset, DatasetFormData, DatasetItem, DatasetItemFormData } from '../types/dataset';

/**
 * データセットAPI
 */
export const datasetsApi = {
  // データセット一覧の取得
  getDatasets: async (): Promise<Dataset[]> => {
    return apiClient.get<Dataset[]>('/datasets');
  },

  // 特定のデータセットの取得
  getDataset: async (id: string): Promise<Dataset> => {
    return apiClient.get<Dataset>(`/datasets/${id}`);
  },

  // データセットの作成
  createDataset: async (data: DatasetFormData): Promise<Dataset> => {
    return apiClient.post<Dataset>('/datasets', data);
  },

  // データセットの更新
  updateDataset: async (id: string, data: DatasetFormData): Promise<Dataset> => {
    return apiClient.put<Dataset>(`/datasets/${id}`, data);
  },

  // データセットの削除
  deleteDataset: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/datasets/${id}`);
  },

  // データセットアイテムの取得
  getDatasetItems: async (datasetId: string): Promise<DatasetItem[]> => {
    return apiClient.get<DatasetItem[]>(`/datasets/${datasetId}/items`);
  },

  // データセットアイテムの追加
  addDatasetItem: async (datasetId: string, data: DatasetItemFormData): Promise<DatasetItem> => {
    return apiClient.post<DatasetItem>(`/datasets/${datasetId}/items`, data);
  },

  // データセットアイテムの更新
  updateDatasetItem: async (datasetId: string, itemId: string, data: DatasetItemFormData): Promise<DatasetItem> => {
    return apiClient.put<DatasetItem>(`/datasets/${datasetId}/items/${itemId}`, data);
  },

  // データセットアイテムの削除
  deleteDatasetItem: async (datasetId: string, itemId: string): Promise<void> => {
    return apiClient.delete<void>(`/datasets/${datasetId}/items/${itemId}`);
  },

  // データセットのインポート（JSONファイル）
  importDataset: async (file: File): Promise<Dataset> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post<Dataset>('/datasets/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // データセットのエクスポート（JSONファイル）
  exportDataset: async (id: string): Promise<Blob> => {
    return apiClient.get<Blob>(`/datasets/${id}/export`, {
      responseType: 'blob',
    });
  },
};
