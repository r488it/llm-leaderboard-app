/**
 * LLMプロバイダの型定義
 */

export type ProviderType = 'azure' | 'ollama' | 'openai' | 'huggingface' | 'custom';

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  endpoint?: string;
  apiKey?: string;
  models: Model[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Model {
  id: string;
  providerId: string;
  name: string;
  displayName: string;
  description?: string;
  parameters?: Record<string, any>;
  isActive: boolean;
}

export interface ProviderFormData {
  name: string;
  type: ProviderType;
  endpoint?: string;
  apiKey?: string;
  isActive: boolean;
}

export interface ModelFormData {
  name: string;
  displayName: string;
  description?: string;
  parameters?: Record<string, any>;
  isActive: boolean;
}
