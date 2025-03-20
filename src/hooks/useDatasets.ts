import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { datasetsApi } from '../api/datasets';
import { Dataset, DatasetFormData, DatasetItem, DatasetItemFormData } from '../types/dataset';

/**
 * データセット関連のカスタムフック
 */

// データセット一覧を取得するフック
export const useDatasets = () => {
  return useQuery<Dataset[], Error>({
    queryKey: ['datasets'],
    queryFn: () => datasetsApi.getDatasets(),
  });
};

// 特定のデータセットを取得するフック
export const useDataset = (id: string) => {
  return useQuery<Dataset, Error>({
    queryKey: ['datasets', id],
    queryFn: () => datasetsApi.getDataset(id),
    enabled: !!id, // idが存在する場合のみクエリを実行
  });
};

// データセットを作成するフック
export const useCreateDataset = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Dataset, Error, DatasetFormData>({
    mutationFn: (data) => datasetsApi.createDataset(data),
    onSuccess: () => {
      // 成功時にデータセット一覧を再取得
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    },
  });
};

// データセットを更新するフック
export const useUpdateDataset = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<Dataset, Error, DatasetFormData>({
    mutationFn: (data) => datasetsApi.updateDataset(id, data),
    onSuccess: () => {
      // 成功時にデータセット一覧と特定のデータセットを再取得
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
      queryClient.invalidateQueries({ queryKey: ['datasets', id] });
    },
  });
};

// データセットを削除するフック
export const useDeleteDataset = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: (id) => datasetsApi.deleteDataset(id),
    onSuccess: () => {
      // 成功時にデータセット一覧を再取得
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    },
  });
};

// データセットアイテム一覧を取得するフック
export const useDatasetItems = (datasetId: string) => {
  return useQuery<DatasetItem[], Error>({
    queryKey: ['datasets', datasetId, 'items'],
    queryFn: () => datasetsApi.getDatasetItems(datasetId),
    enabled: !!datasetId, // datasetIdが存在する場合のみクエリを実行
  });
};

// データセットアイテムを追加するフック
export const useAddDatasetItem = (datasetId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<DatasetItem, Error, DatasetItemFormData>({
    mutationFn: (data) => datasetsApi.addDatasetItem(datasetId, data),
    onSuccess: () => {
      // 成功時にデータセットアイテム一覧を再取得
      queryClient.invalidateQueries({ queryKey: ['datasets', datasetId, 'items'] });
      // データセット自体も更新（アイテム数が変わるため）
      queryClient.invalidateQueries({ queryKey: ['datasets', datasetId] });
    },
  });
};

// データセットアイテムを更新するフック
export const useUpdateDatasetItem = (datasetId: string, itemId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<DatasetItem, Error, DatasetItemFormData>({
    mutationFn: (data) => datasetsApi.updateDatasetItem(datasetId, itemId, data),
    onSuccess: () => {
      // 成功時にデータセットアイテム一覧を再取得
      queryClient.invalidateQueries({ queryKey: ['datasets', datasetId, 'items'] });
    },
  });
};

// データセットアイテムを削除するフック
export const useDeleteDatasetItem = (datasetId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: (itemId) => datasetsApi.deleteDatasetItem(datasetId, itemId),
    onSuccess: () => {
      // 成功時にデータセットアイテム一覧を再取得
      queryClient.invalidateQueries({ queryKey: ['datasets', datasetId, 'items'] });
      // データセット自体も更新（アイテム数が変わるため）
      queryClient.invalidateQueries({ queryKey: ['datasets', datasetId] });
    },
  });
};

// データセットをインポートするフック
export const useImportDataset = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Dataset, Error, File>({
    mutationFn: (file) => datasetsApi.importDataset(file),
    onSuccess: () => {
      // 成功時にデータセット一覧を再取得
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    },
  });
};

// データセットをエクスポートするフック
export const useExportDataset = (datasetId: string) => {
  return useMutation<Blob, Error, void>({
    mutationFn: () => datasetsApi.exportDataset(datasetId),
  });
};
