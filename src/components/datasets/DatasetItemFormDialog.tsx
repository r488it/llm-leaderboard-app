import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Grid,
  CircularProgress,
  IconButton,
  Typography,
  Box,
  Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatasetItemFormData } from '../../types/dataset';

interface DatasetItemFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DatasetItemFormData) => void;
  initialData?: DatasetItemFormData;
  isSubmitting: boolean;
  datasetType: string;
}

/**
 * データセットアイテム追加・編集用のフォームダイアログ
 */
const DatasetItemFormDialog: React.FC<DatasetItemFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
  datasetType
}) => {
  // デフォルト値の設定
  const defaultData: DatasetItemFormData = {
    input: '',
    expectedOutput: '',
    metadata: {}
  };

  // フォームの状態
  const [formData, setFormData] = useState<DatasetItemFormData>(initialData || defaultData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [metadataFields, setMetadataFields] = useState<Array<{key: string, value: string}>>(
    initialData?.metadata 
      ? Object.entries(initialData.metadata).map(([key, value]) => ({ key, value: String(value) }))
      : []
  );

  // フォームリセット
  const resetForm = () => {
    setFormData(initialData || defaultData);
    setMetadataFields(
      initialData?.metadata 
        ? Object.entries(initialData.metadata).map(([key, value]) => ({ key, value: String(value) }))
        : []
    );
    setErrors({});
  };

  // ダイアログを閉じる際の処理
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // 入力値の変更処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
  };

  // メタデータフィールドの追加
  const handleAddMetadataField = () => {
    setMetadataFields([...metadataFields, { key: '', value: '' }]);
  };

  // メタデータフィールドの削除
  const handleRemoveMetadataField = (index: number) => {
    const newFields = [...metadataFields];
    newFields.splice(index, 1);
    setMetadataFields(newFields);
  };

  // メタデータフィールドの変更
  const handleMetadataChange = (index: number, field: 'key' | 'value', value: string) => {
    const newFields = [...metadataFields];
    newFields[index][field] = value;
    setMetadataFields(newFields);
  };

  // バリデーション
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.input.trim()) {
      newErrors.input = '入力は必須です';
    }
    
    // データセットタイプに応じた追加バリデーション
    if (datasetType !== 'custom' && !formData.expectedOutput?.trim()) {
      newErrors.expectedOutput = '期待される出力は必須です';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // フォーム送信
  const handleSubmit = () => {
    if (validate()) {
      // メタデータを構築
      const metadata: Record<string, any> = {};
      metadataFields.forEach(field => {
        if (field.key.trim()) {
          // 数値に変換可能な場合は数値として保存
          const numValue = Number(field.value);
          metadata[field.key] = !isNaN(numValue) && field.value.trim() !== '' ? numValue : field.value;
        }
      });
      
      onSubmit({
        ...formData,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined
      });
    }
  };

  // データセットタイプに応じたラベルの取得
  const getTypeSpecificLabels = () => {
    switch (datasetType) {
      case 'qa':
        return { input: '質問', expectedOutput: '回答' };
      case 'summarization':
        return { input: '原文', expectedOutput: '要約' };
      case 'translation':
        return { input: '原文', expectedOutput: '翻訳' };
      case 'classification':
        return { input: 'テキスト', expectedOutput: 'カテゴリ' };
      case 'custom':
      default:
        return { input: '入力', expectedOutput: '期待される出力' };
    }
  };

  const labels = getTypeSpecificLabels();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? 'データセットアイテムの編集' : 'データセットアイテムの追加'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="input"
              label={labels.input}
              fullWidth
              multiline
              rows={4}
              value={formData.input}
              onChange={handleChange}
              error={!!errors.input}
              helperText={errors.input}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="expectedOutput"
              label={labels.expectedOutput}
              fullWidth
              multiline
              rows={4}
              value={formData.expectedOutput || ''}
              onChange={handleChange}
              error={!!errors.expectedOutput}
              helperText={errors.expectedOutput}
              required={datasetType !== 'custom'}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle1">メタデータ（オプション）</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddMetadataField}
                size="small"
              >
                フィールド追加
              </Button>
            </Box>
            
            {metadataFields.length > 0 ? (
              metadataFields.map((field, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        label="キー"
                        value={field.key}
                        onChange={(e) => handleMetadataChange(index, 'key', e.target.value)}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        label="値"
                        value={field.value}
                        onChange={(e) => handleMetadataChange(index, 'value', e.target.value)}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton 
                        color="error" 
                        onClick={() => handleRemoveMetadataField(index)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                メタデータフィールドはありません。「フィールド追加」ボタンをクリックして追加してください。
              </Typography>
            )}
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

export default DatasetItemFormDialog;
