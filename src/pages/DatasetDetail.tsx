import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  CircularProgress,
  Alert,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useParams, useNavigate } from 'react-router-dom';
import { useDataset, useDatasetItems, useAddDatasetItem, useUpdateDatasetItem, useDeleteDatasetItem, useUpdateDataset, useExportDataset } from '../hooks/useDatasets';
import { DatasetItem, DatasetItemFormData, DatasetFormData } from '../types/dataset';
import { useAppContext } from '../contexts/AppContext';
import DatasetFormDialog from '../components/datasets/DatasetFormDialog';
import DatasetItemFormDialog from '../components/datasets/DatasetItemFormDialog';

/**
 * データセット詳細ページ
 */
const DatasetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const datasetId = id || '';
  
  // コンテキストから状態を取得
  const { setError } = useAppContext();
  
  // タブの状態
  const [tabValue, setTabValue] = useState(0);
  
  // ダイアログの状態
  const [datasetFormDialogOpen, setDatasetFormDialogOpen] = useState(false);
  const [itemFormDialogOpen, setItemFormDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DatasetItem | null>(null);
  
  // データセットとアイテムデータの取得
  const { 
    data: dataset, 
    isLoading: isLoadingDataset, 
    isError: isErrorDataset,
    error: datasetError
  } = useDataset(datasetId);
  
  const {
    data: items,
    isLoading: isLoadingItems,
    isError: isErrorItems,
    error: itemsError
  } = useDatasetItems(datasetId);
  
  // ミューテーションフック
  const updateDataset = useUpdateDataset(datasetId);
  const addDatasetItem = useAddDatasetItem(datasetId);
  const updateDatasetItem = useUpdateDatasetItem(datasetId, editingItem?.id || '');
  const deleteDatasetItem = useDeleteDatasetItem(datasetId);
  const exportDataset = useExportDataset(datasetId);
  
  // エラーハンドリング
  if (datasetError) {
    setError(`データセットの取得に失敗しました: ${datasetError.message}`);
  }
  
  if (itemsError) {
    setError(`データセットアイテムの取得に失敗しました: ${itemsError.message}`);
  }
  
  // タブの変更ハンドラ
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // データセット編集ダイアログを開く
  const handleOpenDatasetFormDialog = () => {
    setDatasetFormDialogOpen(true);
  };
  
  // データセット編集ダイアログを閉じる
  const handleCloseDatasetFormDialog = () => {
    setDatasetFormDialogOpen(false);
  };
  
  // データセットの更新を実行
  const handleSubmitDataset = async (data: DatasetFormData) => {
    try {
      await updateDataset.mutateAsync(data);
      handleCloseDatasetFormDialog();
    } catch (err) {
      if (err instanceof Error) {
        setError(`データセットの更新に失敗しました: ${err.message}`);
      }
    }
  };
  
  // アイテム追加/編集ダイアログを開く
  const handleOpenItemFormDialog = (item?: DatasetItem) => {
    if (item) {
      setEditingItem(item);
    } else {
      setEditingItem(null);
    }
    setItemFormDialogOpen(true);
  };
  
  // アイテム追加/編集ダイアログを閉じる
  const handleCloseItemFormDialog = () => {
    setItemFormDialogOpen(false);
    setEditingItem(null);
  };
  
  // アイテムの追加/編集を実行
  const handleSubmitItem = async (data: DatasetItemFormData) => {
    try {
      if (editingItem) {
        await updateDatasetItem.mutateAsync(data);
      } else {
        await addDatasetItem.mutateAsync(data);
      }
      handleCloseItemFormDialog();
    } catch (err) {
      if (err instanceof Error) {
        setError(`アイテムの${editingItem ? '更新' : '追加'}に失敗しました: ${err.message}`);
      }
    }
  };
  
  // アイテムの削除を実行
  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteDatasetItem.mutateAsync(itemId);
    } catch (err) {
      if (err instanceof Error) {
        setError(`アイテムの削除に失敗しました: ${err.message}`);
      }
    }
  };
  
  // データセット一覧に戻る
  const handleBackToDatasets = () => {
    navigate('/datasets');
  };
  
  // データセットのエクスポート
  const handleExportDataset = async () => {
    try {
      const blob = await exportDataset.mutateAsync();
      
      // ダウンロードリンクを作成
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataset?.name || 'dataset'}.json`;
      document.body.appendChild(a);
      a.click();
      
      // クリーンアップ
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      if (err instanceof Error) {
        setError(`データセットのエクスポートに失敗しました: ${err.message}`);
      }
    }
  };
  
  // ローディング中
  if (isLoadingDataset) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }
  
  // エラー発生時
  if (isErrorDataset || !dataset) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 3 }}>
          データセットの取得中にエラーが発生しました。
        </Alert>
        <Button variant="outlined" onClick={handleBackToDatasets}>
          データセット一覧に戻る
        </Button>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Button variant="outlined" onClick={handleBackToDatasets} sx={{ mb: 1 }}>
            データセット一覧に戻る
          </Button>
          <Typography variant="h4" component="h1">
            {dataset.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            タイプ: {dataset.type} | アイテム数: {dataset.items.length}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportDataset}
            sx={{ mr: 1 }}
            disabled={exportDataset.isPending}
          >
            エクスポート
          </Button>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleOpenDatasetFormDialog}
            sx={{ mr: 1 }}
          >
            編集
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenItemFormDialog()}
          >
            アイテムを追加
          </Button>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="dataset tabs">
          <Tab label="アイテム" id="tab-0" />
          <Tab label="詳細" id="tab-1" />
        </Tabs>
      </Box>
      
      {/* アイテムタブ */}
      {tabValue === 0 && (
        <>
          {isLoadingItems ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : isErrorItems ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              データセットアイテムの取得中にエラーが発生しました。
            </Alert>
          ) : items && items.length > 0 ? (
            <List>
              {items.map((item) => (
                <ListItem
                  key={item.id}
                  secondaryAction={
                    <Box>
                      <IconButton edge="end" aria-label="edit" onClick={() => handleOpenItemFormDialog(item)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteItem(item.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                  sx={{ 
                    mb: 2, 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1
                  }}
                >
                  <ListItemText
                    primary={
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          入力:
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {item.input}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      item.expectedOutput ? (
                        <Box mt={1}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            期待される出力:
                          </Typography>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                            {item.expectedOutput}
                          </Typography>
                        </Box>
                      ) : null
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                アイテムが登録されていません。「アイテムを追加」ボタンをクリックして最初のアイテムを登録してください。
              </Typography>
            </Paper>
          )}
        </>
      )}
      
      {/* 詳細タブ */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  基本情報
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">名前</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">{dataset.name}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">タイプ</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">{dataset.type}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">アイテム数</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">{dataset.items.length}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">作成日</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {new Date(dataset.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">更新日</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {new Date(dataset.updatedAt).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  説明
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {dataset.description || '説明はありません。'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* データセット編集ダイアログ */}
      <DatasetFormDialog
        open={datasetFormDialogOpen}
        onClose={handleCloseDatasetFormDialog}
        onSubmit={handleSubmitDataset}
        initialData={{
          name: dataset.name,
          description: dataset.description,
          type: dataset.type
        }}
        isSubmitting={updateDataset.isPending}
      />
      
      {/* アイテム追加/編集ダイアログ */}
      <DatasetItemFormDialog
        open={itemFormDialogOpen}
        onClose={handleCloseItemFormDialog}
        onSubmit={handleSubmitItem}
        initialData={editingItem ? {
          input: editingItem.input,
          expectedOutput: editingItem.expectedOutput,
          metadata: editingItem.metadata
        } : undefined}
        isSubmitting={addDatasetItem.isPending || updateDatasetItem.isPending}
        datasetType={dataset.type}
      />
    </Box>
  );
};

export default DatasetDetail;
