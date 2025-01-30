import axios from 'axios';

const API_BASE_URL = 'http://localhost:11434/api';  // 直接Ollamaサーバーに接続

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 600000,  // タイムアウトを60秒に延長
  headers: {
    'Content-Type': 'application/json',
  }
});

export const ollamaApi = {
  getModels: async () => {
    try {
      const response = await axiosInstance.get('/tags');
      console.log('モデル一覧のレスポンス:', response.data);
      return response.data;
    } catch (error) {
      console.error('モデル取得エラー:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  generateResponse: async (model, prompt) => {
    try {
      console.log('リクエスト送信:', { model, prompt });  // デバッグ用

      const response = await axiosInstance.post('/generate', {
        model,
        prompt,
        stream: false
      });

      console.log('生成レスポンス:', response.data);  // デバッグ用

      if (!response.data || !response.data.response) {
        throw new Error('Invalid response format');
      }

      return {
        response: response.data.response
      };
    } catch (error) {
      console.error('生成エラー:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        fullError: error
      });
      throw error;
    }
  }
}; 