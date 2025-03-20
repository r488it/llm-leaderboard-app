import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * APIクライアントの設定
 */
class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // リクエストインターセプター
    this.client.interceptors.request.use(
      (config) => {
        // APIキーがある場合はヘッダーに追加
        const apiKey = localStorage.getItem('api_key');
        if (apiKey) {
          config.headers['Authorization'] = `Bearer ${apiKey}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // レスポンスインターセプター
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // エラーハンドリング
        if (error.response) {
          // サーバーからのレスポンスがある場合
          console.error('API Error:', error.response.data);
        } else if (error.request) {
          // リクエストは送信されたがレスポンスがない場合
          console.error('API Request Error:', error.request);
        } else {
          // リクエスト設定中にエラーが発生した場合
          console.error('API Config Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  // GETリクエスト
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  // POSTリクエスト
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  // PUTリクエスト
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  // DELETEリクエスト
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Blobリクエスト (ファイルダウンロード用)
  async getBlob(url: string, config?: AxiosRequestConfig): Promise<Blob> {
    const response = await this.client.get(url, {
      ...config,
      responseType: 'blob'
    });
    return response.data;
  }
}

// シングルトンインスタンスをエクスポート
export const apiClient = new ApiClient();