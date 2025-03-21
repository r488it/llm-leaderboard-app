import { apiClient } from './client';
import { Provider, ProviderFormData, Model, ModelFormData } from '../types/provider';

/**
 * LLMプロバイダAPI
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

  // プロバイダのモデル一覧の取得
  getProviderModels: async (providerId: string): Promise<Model[]> => {
    return apiClient.get<Model[]>(`/providers/${providerId}/models`);
  },

  // モデルの作成
  createModel: async (providerId: string, data: ModelFormData): Promise<Model> => {
    console.log(`Creating model for provider ${providerId}:`, data);
    try {
      const result = await apiClient.post<Model>(`/providers/${providerId}/models`, data);
      console.log('API response:', result);
      return result;
    } catch (error) {
      console.error('API error creating model:', error);
      throw error;
    }
  },

  // モデルの更新
  updateModel: async (providerId: string, modelId: string, data: ModelFormData): Promise<Model> => {
    return apiClient.put<Model>(`/providers/${providerId}/models/${modelId}`, data);
  },

  // モデルの削除
  deleteModel: async (providerId: string, modelId: string): Promise<void> => {
    return apiClient.delete<void>(`/providers/${providerId}/models/${modelId}`);
  },

  // Azure OpenAI プロバイダの検証
  validateAzureProvider: async (endpoint: string, apiKey: string): Promise<boolean> => {
    try {
      await apiClient.post<any>('/providers/validate/azure', { endpoint, apiKey });
      return true;
    } catch (error) {
      return false;
    }
  },

  // OpenAI プロバイダの検証
  validateOpenAIProvider: async (apiKey: string): Promise<boolean> => {
    try {
      await apiClient.post<any>('/providers/validate/openai', { apiKey });
      return true;
    } catch (error) {
      return false;
    }
  },

  // Ollama プロバイダの検証
  validateOllamaProvider: async (endpoint: string): Promise<boolean> => {
    try {
      await apiClient.post<any>('/providers/validate/ollama', { endpoint });
      return true;
    } catch (error) {
      return false;
    }
  },

  // HuggingFace プロバイダの検証
  validateHuggingFaceProvider: async (apiKey: string): Promise<boolean> => {
    try {
      await apiClient.post<any>('/providers/validate/huggingface', { apiKey });
      return true;
    } catch (error) {
      return false;
    }
  }
};
