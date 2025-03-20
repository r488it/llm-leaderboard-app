import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid,
  CircularProgress,
  FormHelperText,
  SelectChangeEvent
} from '@mui/material';
import { InferenceFormData } from '../../types/inference';
import { Dataset } from '../../types/dataset';
import { Provider, Model } from '../../types/provider';

interface InferenceFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: InferenceFormData) => void;
  initialData?: InferenceFormData;
  isSubmitting: boolean;
  datasets: Dataset[];
  providers: Provider[];
  models: Model[];
}

/**
 * 推論作成用のフォームダイアログ
 */
const InferenceFormDialog: React.FC<InferenceFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
  datasets,
  providers,
  models
}) => {
  // デフォルト値の設定
  const defaultData: InferenceFormData = {
    name: '',
    description: '',
    datasetId: '',
    providerId: '',
    modelId: ''
  };

  // フォームの状態
  const [formData, setFormData] = useState<InferenceFormData>(initialData || defaultData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // フォームリセット
  const resetForm = () => {
    setFormData(initialData || defaultData);
    setErrors({});
  };

  // ダイアログを閉じる際の処理
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // 入力値の変更処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // エラーをクリア
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  // バリデーション
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '名前は必須です';
    }
    
    if (!formData.datasetId) {
      newErrors.datasetId = 'データセットは必須です';
    }
    
    if (!formData.providerId) {
      newErrors.providerId = 'プロバイダは必須です';
    }
    
    if (!formData.modelId) {
      newErrors.modelId = 'モデルは必須です';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // フォーム送信
  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
    }
  };

  // 選択されたプロバイダに基づいてフィルタリングされたモデルリスト
  const filteredModels = models.filter(model => {
    // プロバイダが選択されていない場合はすべてのモデルを表示
    if (!formData.providerId) return true;
    // モデルのプロバイダIDと選択されたプロバイダIDが一致するモデルのみ表示
    return model.providerId === formData.providerId;
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        推論の作成
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="推論名"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="description"
              label="説明"
              fullWidth
              multiline
              rows={3}
              value={formData.description || ''}
              onChange={handleChange}
              helperText="推論の説明（オプション）"
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth required error={!!errors.datasetId}>
              <InputLabel>データセット</InputLabel>
              <Select
                name="datasetId"
                value={formData.datasetId}
                onChange={handleChange}
                label="データセット"
              >
                {datasets.map((dataset) => (
                  <MenuItem key={dataset.id} value={dataset.id}>
                    {dataset.name} ({dataset.type})
                  </MenuItem>
                ))}
              </Select>
              {errors.datasetId && <FormHelperText>{errors.datasetId}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth required error={!!errors.providerId}>
              <InputLabel>プロバイダ</InputLabel>
              <Select
                name="providerId"
                value={formData.providerId}
                onChange={handleChange}
                label="プロバイダ"
              >
                {providers.map((provider) => (
                  <MenuItem key={provider.id} value={provider.id}>
                    {provider.name} ({provider.type})
                  </MenuItem>
                ))}
              </Select>
              {errors.providerId && <FormHelperText>{errors.providerId}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth required error={!!errors.modelId}>
              <InputLabel>モデル</InputLabel>
              <Select
                name="modelId"
                value={formData.modelId}
                onChange={handleChange}
                label="モデル"
                disabled={!formData.providerId}
              >
                {filteredModels.map((model) => (
                  <MenuItem key={model.id} value={model.id}>
                    {model.displayName}
                  </MenuItem>
                ))}
              </Select>
              {errors.modelId && <FormHelperText>{errors.modelId}</FormHelperText>}
              {!formData.providerId && <FormHelperText>先にプロバイダを選択してください</FormHelperText>}
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>キャンセル</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          作成
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InferenceFormDialog;
