import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Button
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Model } from '../../types/provider';

interface ModelCardProps {
  model: Model;
  onSelect?: (model: Model) => void;
  onEdit?: (model: Model) => void;
  onDelete?: (modelId: string) => void;
}

/**
 * モデル情報を表示するカードコンポーネント
 */
const ModelCard: React.FC<ModelCardProps> = ({ 
  model, 
  onSelect, 
  onEdit, 
  onDelete 
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(model);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(model);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && confirm('このモデルを削除してもよろしいですか？')) {
      onDelete(model.id);
    }
  };

  return (
    <Card 
      sx={{ 
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onClick={handleClick}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="div" noWrap>
            {model.displayName}
          </Typography>
          <Stack direction="row" spacing={1}>
            {model.description && (
              <Tooltip title={model.description}>
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onEdit && (
              <IconButton size="small" onClick={handleEdit}>
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton size="small" color="error" onClick={handleDelete}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        </Box>
        
        <Typography variant="body2" color="text.secondary" mb={2} noWrap>
          {model.name}
        </Typography>
        
        <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
          <Chip 
            label={model.isActive ? 'アクティブ' : '非アクティブ'} 
            size="small"
            color={model.isActive ? 'success' : 'default'}
            variant="outlined"
          />
          
          {model.parameters && Object.entries(model.parameters).map(([key, value]) => (
            <Chip 
              key={key}
              label={`${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ModelCard;
