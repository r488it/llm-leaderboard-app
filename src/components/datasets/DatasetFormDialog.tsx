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
  CircularProgress
} from '@mui/material';
import { DatasetFormData, DatasetType } from '../../types/dataset';

interface DatasetFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DatasetFormData) => void;
  initialData?: DatasetFormData;
  isSubmitting: boolean;
}

/**
 * データセット追加・編集用のフォームダイアログ
 */
const DatasetFormDialog: React.FC<DatasetFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isSubmitting
}) => {
  // デフォルト値の設定
  const defaultData: DatasetFormData = {
    name: '',
    description: '',
    type: 'qa'
  };

  // フォームの状態
  const [formData, setFormData] = useState<DatasetFormData>(initialData || defaultData);
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // フォーム送信
  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? 'データセットの編集' : 'データセットの追加'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="データセット名"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>データセットタイプ</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="データセットタイプ"
              >
                <MenuItem value="qa">質問応答</MenuItem>
                <MenuItem value="summarization">要約</MenuItem>
                <MenuItem value="translation">翻訳</MenuItem>
                <MenuItem value="classification">分類</MenuItem>
                <MenuItem value="custom">カスタム</MenuItem>
              </Select>
            </FormControl>
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
              helperText="データセットの説明（オプション）"
            />
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
          {initialData ? '更新' : '追加'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DatasetFormDialog;
