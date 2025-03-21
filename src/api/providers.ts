import { apiClient } from './client';
import { Provider, ProviderFormData, Model, ModelFormData } from '../types/provider';

/**
 * LLMプロバイダとモデルAPI
 */
export const providersApi = {
  // プロバイダ一覧の取得
  getProviders: async (): Promise<Provider[]> => {
    return apiClient.get<Provider[]>('/providers');
  },

  // 特定のプロバイダの取得
  getProvider: async (id: string): Promise<Provider> => {
    return apiClient.get<Provider>(`/providers/${id}`);
  },

  // プロバイダの作成
  createProvider: async (data: ProviderFormData): Promise<Provider> => {
    return apiClient.post<Provider>('/providers', data);
  },

  // プロバイダの更新
  updateProvider: async (id: string, data: ProviderFormData): Promise<Provider> => {
    return apiClient.put<Provider>(`/providers/${id}`, data);
  },

  // プロバイダの削除
  deleteProvider: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/providers/${id}`);
  },

  // すべてのモデル一覧の取得
  getAllModels: async (): Promise<Model[]> => {
    return apiClient.get<Model[]>('/models');
  },

  // 特定のモデルの取得
  getModel: async (id: string): Promise<Model> => {
    return apiClient.get<Model>(`/models/${id}`);
  },

  // プロバイダのモデル一覧の取得
  getProviderModels: async (providerId: string): Promise<Model[]> => {
    return apiClient.get<Model[]>(`/providers/${providerId}/models`);
  },

  // モデルの作成
  createModel: async (data: ModelFormData): Promise<Model> => {
    console.log(`Creating model:`, data);
    try {
      const result = await apiClient.post<Model>(`/models`, data);
      console.log('API response:', result);
      return result;
    } catch (error) {
      console.error('API error creating model:', error);
      throw error;
    }
  },

  // モデルの更新
  updateModel: async (modelId: string, data: ModelFormData): Promise<Model> => {
    return apiClient.put<Model>(`/models/${modelId}`, data);
  },

  // モデルの削除
  deleteModel: async (modelId: string): Promise<void> => {
    return apiClient.delete<void>(`/models/${modelId}`);
  }
};
