import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip, 
  Stack, 
  IconButton 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Dataset } from '../../types/dataset';

interface DatasetCardProps {
  dataset: Dataset;
  onEdit: (dataset: Dataset) => void;
  onDelete: (datasetId: string) => void;
  onView: (dataset: Dataset) => void;
}

/**
 * データセット情報を表示するカードコンポーネント
 */
const DatasetCard: React.FC<DatasetCardProps> = ({ dataset, onEdit, onDelete, onView }) => {
  // データセットタイプに応じた色を設定
  const getDatasetTypeColor = (type: string) => {
    switch (type) {
      case 'qa':
        return '#4CAF50';
      case 'summarization':
        return '#2196F3';
      case 'translation':
        return '#9C27B0';
      case 'classification':
        return '#FF9800';
      case 'custom':
        return '#607D8B';
      default:
        return '#757575';
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="div">
            {dataset.name}
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton size="small" onClick={() => onView(dataset)} aria-label="表示">
              <VisibilityIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onEdit(dataset)} aria-label="編集">
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => onDelete(dataset.id)} 
              aria-label="削除"
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
        
        <Box display="flex" alignItems="center" mb={2}>
          <Chip 
            label={dataset.type} 
            size="small" 
            sx={{ 
              backgroundColor: getDatasetTypeColor(dataset.type),
              color: 'white',
              mr: 1
            }} 
          />
          <Typography variant="body2" color="text.secondary">
            {dataset.items.length} アイテム
          </Typography>
        </Box>
        
        {dataset.description && (
          <Typography variant="body2" color="text.secondary" mb={2}>
            {dataset.description}
          </Typography>
        )}
        
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => onView(dataset)}
          >
            詳細を表示
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DatasetCard;
