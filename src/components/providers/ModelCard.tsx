import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { Model } from '../../types/provider';

interface ModelCardProps {
  model: Model;
  onSelect: (model: Model) => void;
}

/**
 * モデル情報を表示するカードコンポーネント
 */
const ModelCard: React.FC<ModelCardProps> = ({ model, onSelect }) => {
  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onClick={() => onSelect(model)}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="div" noWrap>
            {model.displayName}
          </Typography>
          {model.description && (
            <Tooltip title={model.description}>
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
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
