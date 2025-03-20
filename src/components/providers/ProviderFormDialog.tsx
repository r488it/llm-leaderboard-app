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
  FormHelperText,
  Switch,
  FormControlLabel,
  Grid,
  Typography,
  CircularProgress,
  SelectChangeEvent
} from '@mui/material';
import { ProviderFormData, ProviderType } from '../../types/provider';
import { useValidateProvider } from '../../hooks/useProviders';

interface ProviderFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProviderFormData) => void;
  initialData?: ProviderFormData;
  isSubmitting: boolean;
}

/**
 * プロバイダ追加・編集用のフォームダイアログ
 */
const ProviderFormDialog: React.FC<ProviderFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isSubmitting
}) => {
  // デフォルト値の設定
  const defaultData: ProviderFormData = {
    name: '',
    type: 'custom',
    endpoint: '',
    apiKey: '',
    isActive: true
  };

  // フォームの状態
  const [formData, setFormData] = useState<ProviderFormData>(initialData || defaultData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<boolean | null>(null);

  // プロバイダ検証フック
  const validateProvider = useValidateProvider();

  // フォームリセット
  const resetForm = () => {
    setFormData(initialData || defaultData);
    setErrors({});
    setValidationResult(null);
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

  // スイッチの変更処理
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // プロバイダタイプの変更処理
  const handleTypeChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value as ProviderType;
    setFormData(prev => ({
      ...prev,
      type: value,
      // タイプに応じてエンドポイントをリセット
      endpoint: value === 'openai' || value === 'huggingface' ? '' : prev.endpoint,
      // タイプに応じてAPIキーをリセット
      apiKey: value === 'ollama' ? '' : prev.apiKey
    }));
  };

  // バリデーション
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '名前は必須です';
    }
    
    if (formData.type === 'azure') {
      if (!formData.endpoint) {
        newErrors.endpoint = 'エンドポイントは必須です';
      }
      if (!formData.apiKey) {
        newErrors.apiKey = 'APIキーは必須です';
      }
    } else if (formData.type === 'ollama') {
      if (!formData.endpoint) {
        newErrors.endpoint = 'エンドポイントは必須です';
      }
    } else if (formData.type === 'openai' || formData.type === 'huggingface') {
      if (!formData.apiKey) {
        newErrors.apiKey = 'APIキーは必須です';
      }
    } else if (formData.type === 'custom') {
      if (!formData.endpoint) {
        newErrors.endpoint = 'エンドポイントは必須です';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // プロバイダの接続テスト
  const handleValidate = async () => {
    if (!validate()) return;
    
    setIsValidating(true);
    setValidationResult(null);
    
    try {
      let result = false;
      
      switch (formData.type) {
        case 'azure':
          result = await validateProvider.validateAzure(formData.endpoint!, formData.apiKey!);
          break;
        case 'openai':
          result = await validateProvider.validateOpenAI(formData.apiKey!);
          break;
        case 'ollama':
          result = await validateProvider.validateOllama(formData.endpoint!);
          break;
        case 'huggingface':
          result = await validateProvider.validateHuggingFace(formData.apiKey!);
          break;
        default:
          // カスタムプロバイダの場合は検証をスキップ
          result = true;
      }
      
      setValidationResult(result);
    } catch (error) {
      setValidationResult(false);
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
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
        {initialData ? 'プロバイダの編集' : 'プロバイダの追加'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="プロバイダ名"
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
              <InputLabel>プロバイダタイプ</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleTypeChange}
                label="プロバイダタイプ"
              >
                <MenuItem value="azure">Azure OpenAI</MenuItem>
                <MenuItem value="openai">OpenAI</MenuItem>
                <MenuItem value="ollama">Ollama</MenuItem>
                <MenuItem value="huggingface">HuggingFace</MenuItem>
                <MenuItem value="custom">カスタム</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {(formData.type === 'azure' || formData.type === 'ollama' || formData.type === 'custom') && (
            <Grid item xs={12}>
              <TextField
                name="endpoint"
                label="エンドポイント"
                fullWidth
                value={formData.endpoint || ''}
                onChange={handleChange}
                error={!!errors.endpoint}
                helperText={errors.endpoint || '例: https://example.openai.azure.com/ または http://localhost:11434'}
                required={formData.type !== 'custom'}
              />
            </Grid>
          )}
          
          {(formData.type === 'azure' || formData.type === 'openai' || formData.type === 'huggingface') && (
            <Grid item xs={12}>
              <TextField
                name="apiKey"
                label="APIキー"
                fullWidth
                type="password"
                value={formData.apiKey || ''}
                onChange={handleChange}
                error={!!errors.apiKey}
                helperText={errors.apiKey}
                required
              />
            </Grid>
          )}
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleSwitchChange}
                  color="primary"
                />
              }
              label="アクティブ"
            />
            <FormHelperText>アクティブなプロバイダのみが評価に使用されます</FormHelperText>
          </Grid>
          
          {formData.type !== 'custom' && (
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleValidate}
                disabled={isValidating}
                startIcon={isValidating ? <CircularProgress size={20} /> : null}
              >
                接続テスト
              </Button>
              
              {validationResult !== null && (
                <Typography
                  variant="body2"
                  color={validationResult ? 'success.main' : 'error'}
                  sx={{ mt: 1, ml: 1, display: 'inline-block' }}
                >
                  {validationResult
                    ? '接続に成功しました'
                    : '接続に失敗しました。設定を確認してください'}
                </Typography>
              )}
            </Grid>
          )}
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

export default ProviderFormDialog;
