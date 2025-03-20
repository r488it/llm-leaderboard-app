import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { providersApi } from '../api/providers';
import { Provider, ProviderFormData, Model, ModelFormData } from '../types/provider';

/**
 * LLMプロバイダ関連のカスタムフック
 */

// プロバイダ一覧を取得するフック
export const useProviders = () => {
  return useQuery<Provider[], Error>({
    queryKey: ['providers'],
    queryFn: () => providersApi.getProviders(),
  });
};

// 特定のプロバイダを取得するフック
export const useProvider = (id: string) => {
  return useQuery<Provider, Error>({
    queryKey: ['providers', id],
    queryFn: () => providersApi.getProvider(id),
    enabled: !!id, // idが存在する場合のみクエリを実行
  });
};

// プロバイダを作成するフック
export const useCreateProvider = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Provider, Error, ProviderFormData>({
    mutationFn: (data) => providersApi.createProvider(data),
    onSuccess: () => {
      // 成功時にプロバイダ一覧を再取得
      queryClient.invalidateQueries({ queryKey: ['providers'] });
    },
  });
};

// プロバイダを更新するフック
export const useUpdateProvider = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<Provider, Error, ProviderFormData>({
    mutationFn: (data) => providersApi.updateProvider(id, data),
    onSuccess: () => {
      // 成功時にプロバイダ一覧と特定のプロバイダを再取得
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['providers', id] });
    },
  });
};

// プロバイダを削除するフック
export const useDeleteProvider = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: (id) => providersApi.deleteProvider(id),
    onSuccess: () => {
      // 成功時にプロバイダ一覧を再取得
      queryClient.invalidateQueries({ queryKey: ['providers'] });
    },
  });
};

// プロバイダのモデル一覧を取得するフック
export const useProviderModels = (providerId: string) => {
  return useQuery<Model[], Error>({
    queryKey: ['providers', providerId, 'models'],
    queryFn: () => providersApi.getProviderModels(providerId),
    enabled: !!providerId, // providerIdが存在する場合のみクエリを実行
  });
};

// モデルを作成するフック
export const useCreateModel = (providerId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<Model, Error, ModelFormData>({
    mutationFn: (data) => providersApi.createModel(providerId, data),
    onSuccess: () => {
      // 成功時にモデル一覧を再取得
      queryClient.invalidateQueries({ queryKey: ['providers', providerId, 'models'] });
    },
  });
};

// モデルを更新するフック
export const useUpdateModel = (providerId: string, modelId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<Model, Error, ModelFormData>({
    mutationFn: (data) => providersApi.updateModel(providerId, modelId, data),
    onSuccess: () => {
      // 成功時にモデル一覧を再取得
      queryClient.invalidateQueries({ queryKey: ['providers', providerId, 'models'] });
    },
  });
};

// モデルを削除するフック
export const useDeleteModel = (providerId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: (modelId) => providersApi.deleteModel(providerId, modelId),
    onSuccess: () => {
      // 成功時にモデル一覧を再取得
      queryClient.invalidateQueries({ queryKey: ['providers', providerId, 'models'] });
    },
  });
};

// プロバイダを検証するフック
export const useValidateProvider = () => {
  return {
    validateAzure: (endpoint: string, apiKey: string) => 
      providersApi.validateAzureProvider(endpoint, apiKey),
    validateOpenAI: (apiKey: string) => 
      providersApi.validateOpenAIProvider(apiKey),
    validateOllama: (endpoint: string) => 
      providersApi.validateOllamaProvider(endpoint),
    validateHuggingFace: (apiKey: string) => 
      providersApi.validateHuggingFaceProvider(apiKey),
  };
};
