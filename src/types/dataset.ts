/**
 * データセットの型定義
 */

export type DatasetType = 'qa' | 'summarization' | 'translation' | 'classification' | 'custom';

export interface Dataset {
  id: string;
  name: string;
  description?: string;
  type: DatasetType;
  items: DatasetItem[];
  itemCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatasetItem {
  id: string;
  input: string;
  expectedOutput?: string;
  metadata?: Record<string, any>;
}

export interface DatasetFormData {
  name: string;
  description?: string;
  type: DatasetType;
}

export interface DatasetItemFormData {
  input: string;
  expectedOutput?: string;
  metadata?: Record<string, any>;
}
