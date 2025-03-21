/**
 * LLMプロバイダとモデルの型定義
 */

export type ProviderType = 'azure' | 'ollama' | 'openai' | 'huggingface' | 'custom';

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  endpoint?: string;
  apiKey?: string;
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
  endpoint?: string;
  apiKey?: string;
  parameters?: Record<string, any>;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProviderFormData {
  name: string;
  type: ProviderType;
  endpoint?: string;
  apiKey?: string;
  isActive: boolean;
}

export interface ModelFormData {
  providerId: string;
  name: string;
  displayName: string;
  description?: string;
  endpoint: string;
  apiKey: string;
  parameters?: Record<string, any>;
  isActive: boolean;
}
