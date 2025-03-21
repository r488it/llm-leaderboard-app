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
import { useNavigate } from 'react-router-dom';
import ModelCard from '../components/providers/ModelCard';
import ModelFormDialog from '../components/providers/ModelFormDialog';
import { useModels, useCreateModel, useUpdateModel, useDeleteModel } from '../hooks/useProviders';
import { Model, ModelFormData } from '../types/provider';
import { useAppContext } from '../contexts/AppContext';

/**
 * モデル管理ページ
 */
const Providers: React.FC = () => {
  // コンテキストから状態を取得
  const { setError } = useAppContext();
  const navigate = useNavigate();
  
  // ダイアログの状態
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  
  // モデルデータの取得
  const { 
    data: models, 
    isLoading, 
    isError, 
    error 
  } = useModels();
  
  // ミューテーションフック
  const createModel = useCreateModel();
  const updateModel = useUpdateModel(editingModel?.id || '');
  const deleteModel = useDeleteModel();
  
  // エラーハンドリング
  if (error) {
    setError(`モデルの取得に失敗しました: ${error.message}`);
  }
  
  // モデルの追加/編集ダイアログを開く
  const handleOpenFormDialog = (model?: Model) => {
    if (model) {
      setEditingModel(model);
    } else {
      setEditingModel(null);
    }
    setFormDialogOpen(true);
  };
  
  // モデルの追加/編集ダイアログを閉じる
  const handleCloseFormDialog = () => {
    setFormDialogOpen(false);
    setEditingModel(null);
  };
  
  // モデルの追加/編集を実行
  const handleSubmitModel = async (data: ModelFormData) => {
    try {
      if (editingModel) {
        await updateModel.mutateAsync(data);
      } else {
        await createModel.mutateAsync(data);
      }
      handleCloseFormDialog();
    } catch (err) {
      if (err instanceof Error) {
        setError(`モデルの${editingModel ? '更新' : '追加'}に失敗しました: ${err.message}`);
      }
    }
  };
  
  // モデルの削除を実行
  const handleDeleteModel = async (model: Model) => {
    try {
      await deleteModel.mutateAsync({
        modelId: model.id,
        providerId: model.providerId
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(`モデルの削除に失敗しました: ${err.message}`);
      }
    }
  };
  
  // モデル詳細ページに遷移
  const handleSelectModel = (model: Model) => {
    // モデル詳細ページへの遷移
    navigate(`/models/${model.id}`);
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          LLMモデル管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenFormDialog()}
        >
          モデルを追加
        </Button>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          モデルの取得中にエラーが発生しました。
        </Alert>
      ) : models && models.length > 0 ? (
        <Grid container spacing={2}>
          {models.map((model) => (
            <Grid item xs={12} sm={6} md={4} key={model.id}>
              <ModelCard
                model={model}
                onEdit={handleOpenFormDialog}
                onDelete={() => handleDeleteModel(model)}
                onSelect={handleSelectModel}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            モデルが登録されていません。「モデルを追加」ボタンをクリックして最初のモデルを登録してください。
          </Typography>
        </Paper>
      )}
      
      {/* モデル追加/編集ダイアログ */}
      <ModelFormDialog
        open={formDialogOpen}
        onClose={handleCloseFormDialog}
        onSubmit={handleSubmitModel}
        initialData={editingModel ? {
          providerId: editingModel.providerId,
          name: editingModel.name,
          displayName: editingModel.displayName,
          description: editingModel.description,
          endpoint: editingModel.endpoint || '',
          apiKey: editingModel.apiKey || '',
          parameters: editingModel.parameters,
          isActive: editingModel.isActive
        } : undefined}
        isSubmitting={createModel.isPending || updateModel.isPending}
      />
    </Box>
  );
};

export default Providers;
