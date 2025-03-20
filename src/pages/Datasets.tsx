import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useDatasets, useCreateDataset, useUpdateDataset, useDeleteDataset, useImportDataset } from '../hooks/useDatasets';
import { Dataset, DatasetFormData } from '../types/dataset';
import { useAppContext } from '../contexts/AppContext';
import DatasetCard from '../components/datasets/DatasetCard';
import DatasetFormDialog from '../components/datasets/DatasetFormDialog';
import { useNavigate } from 'react-router-dom';

/**
 * データセット管理ページ
 */
const Datasets: React.FC = () => {
  const navigate = useNavigate();
  
  // コンテキストから状態を取得
  const { setError } = useAppContext();
  
  // ダイアログの状態
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingDataset, setEditingDataset] = useState<Dataset | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  
  // データセットデータの取得
  const { 
    data: datasets, 
    isLoading, 
    isError, 
    error 
  } = useDatasets();
  
  // ミューテーションフック
  const createDataset = useCreateDataset();
  const updateDataset = useUpdateDataset(editingDataset?.id || '');
  const deleteDataset = useDeleteDataset();
  const importDataset = useImportDataset();
  
  // エラーハンドリング
  if (error) {
    setError(`データセットの取得に失敗しました: ${error.message}`);
  }
  
  // データセットの追加/編集ダイアログを開く
  const handleOpenFormDialog = (dataset?: Dataset) => {
    if (dataset) {
      setEditingDataset(dataset);
    } else {
      setEditingDataset(null);
    }
    setFormDialogOpen(true);
  };
  
  // データセットの追加/編集ダイアログを閉じる
  const handleCloseFormDialog = () => {
    setFormDialogOpen(false);
    setEditingDataset(null);
  };
  
  // データセットの追加/編集を実行
  const handleSubmitDataset = async (data: DatasetFormData) => {
    try {
      if (editingDataset) {
        await updateDataset.mutateAsync(data);
      } else {
        await createDataset.mutateAsync(data);
      }
      handleCloseFormDialog();
    } catch (err) {
      if (err instanceof Error) {
        setError(`データセットの${editingDataset ? '更新' : '追加'}に失敗しました: ${err.message}`);
      }
    }
  };
  
  // データセットの削除を実行
  const handleDeleteDataset = async (id: string) => {
    try {
      await deleteDataset.mutateAsync(id);
    } catch (err) {
      if (err instanceof Error) {
        setError(`データセットの削除に失敗しました: ${err.message}`);
      }
    }
  };
  
  // データセットの詳細を表示
  const handleViewDataset = (dataset: Dataset) => {
    navigate(`/datasets/${dataset.id}`);
  };
  
  // ファイルインポートハンドラ
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      await importDataset.mutateAsync(file);
      // ファイル入力をリセット
      event.target.value = '';
    } catch (err) {
      if (err instanceof Error) {
        setError(`データセットのインポートに失敗しました: ${err.message}`);
      }
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          データセット管理
        </Typography>
        <Box>
          <input
            accept=".json"
            id="import-dataset-file"
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileImport}
          />
          <label htmlFor="import-dataset-file">
            <Button
              variant="outlined"
              component="span"
              startIcon={<UploadFileIcon />}
              sx={{ mr: 1 }}
              disabled={importDataset.isPending}
            >
              インポート
            </Button>
          </label>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenFormDialog()}
          >
            データセットを追加
          </Button>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          データセットの取得中にエラーが発生しました。
        </Alert>
      ) : datasets && datasets.length > 0 ? (
        <Grid container spacing={2}>
          {datasets.map((dataset) => (
            <Grid item xs={12} sm={6} md={4} key={dataset.id}>
              <DatasetCard
                dataset={dataset}
                onEdit={handleOpenFormDialog}
                onDelete={handleDeleteDataset}
                onView={handleViewDataset}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            データセットが登録されていません。「データセットを追加」ボタンをクリックして最初のデータセットを登録してください。
          </Typography>
        </Paper>
      )}
      
      {/* データセット追加/編集ダイアログ */}
      <DatasetFormDialog
        open={formDialogOpen}
        onClose={handleCloseFormDialog}
        onSubmit={handleSubmitDataset}
        initialData={editingDataset ? {
          name: editingDataset.name,
          description: editingDataset.description,
          type: editingDataset.type
        } : undefined}
        isSubmitting={createDataset.isPending || updateDataset.isPending}
      />
    </Box>
  );
};

export default Datasets;
