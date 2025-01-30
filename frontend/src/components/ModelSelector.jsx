import { Select } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { ollamaApi } from '../services/ollamaApi';

export const ModelSelector = ({ onModelSelect }) => {
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await ollamaApi.getModels();
        console.log('取得したモデル:', response);  // データを確認
        
        // レスポンスの構造に応じて適切に処理
        const modelList = Array.isArray(response.models) 
          ? response.models 
          : Object.keys(response).map(name => ({ name }));
        
        setModels(modelList);
        setError(null);
      } catch (error) {
        console.error('モデル一覧の取得に失敗しました:', error);
        setError('モデル一覧の取得に失敗しました');
      }
    };
    
    fetchModels();
  }, []);

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <Select 
      placeholder="モデルを選択" 
      onChange={(e) => onModelSelect(e.target.value)}
      isDisabled={models.length === 0}
    >
      {models.map((model) => (
        <option key={model.name || model} value={model.name || model}>
          {model.name || model}
        </option>
      ))}
    </Select>
  );
}; 