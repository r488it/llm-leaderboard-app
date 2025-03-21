import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// データベースファイルのパスを決定
// Viteを使用しているため、環境に応じてパスを調整
const DB_PATH = 'llm_leaderboard.db';

/**
 * SQLiteデータベース接続の管理クラス
 */
class DatabaseManager {
  private static instance: DatabaseManager;
  private db: Database.Database;

  private constructor() {
    this.db = new Database(DB_PATH);
    this.db.pragma('journal_mode = WAL'); // Write-Ahead Logging モードを有効化
    this.initDatabase();
  }

  /**
   * シングルトンインスタンスを取得
   */
  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * データベース接続を取得
   */
  public getDb(): Database.Database {
    return this.db;
  }

  /**
   * データベースを初期化
   */
  private initDatabase(): void {
    // プロバイダテーブルを作成
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS providers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // モデルテーブルを作成
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS models (
        id TEXT PRIMARY KEY,
        provider_id TEXT NOT NULL,
        name TEXT NOT NULL,
        display_name TEXT NOT NULL,
        description TEXT,
        endpoint TEXT,
        api_key TEXT,
        parameters TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (provider_id) REFERENCES providers (id) ON DELETE CASCADE
      );
    `);

    // データセットテーブルを作成
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS datasets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // データセットアイテムテーブルを作成
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS dataset_items (
        id TEXT PRIMARY KEY,
        dataset_id TEXT NOT NULL,
        input TEXT NOT NULL,
        expected_output TEXT,
        metadata TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (dataset_id) REFERENCES datasets (id) ON DELETE CASCADE
      );
    `);

    // 推論テーブルを作成
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS inferences (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        dataset_id TEXT NOT NULL,
        provider_id TEXT NOT NULL,
        model_id TEXT NOT NULL,
        status TEXT NOT NULL,
        progress INTEGER NOT NULL DEFAULT 0,
        metrics TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        completed_at TEXT,
        error TEXT,
        FOREIGN KEY (dataset_id) REFERENCES datasets (id) ON DELETE CASCADE,
        FOREIGN KEY (provider_id) REFERENCES providers (id) ON DELETE CASCADE,
        FOREIGN KEY (model_id) REFERENCES models (id) ON DELETE CASCADE
      );
    `);

    // 推論結果テーブルを作成
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS inference_results (
        id TEXT PRIMARY KEY,
        inference_id TEXT NOT NULL,
        dataset_item_id TEXT NOT NULL,
        input TEXT NOT NULL,
        expected_output TEXT,
        actual_output TEXT NOT NULL,
        metrics TEXT,
        metadata TEXT,
        error TEXT,
        latency REAL,
        token_count INTEGER,
        created_at TEXT NOT NULL,
        FOREIGN KEY (inference_id) REFERENCES inferences (id) ON DELETE CASCADE,
        FOREIGN KEY (dataset_item_id) REFERENCES dataset_items (id) ON DELETE CASCADE
      );
    `);

    // 評価指標テーブルを作成
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS metrics (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        parameters TEXT,
        is_higher_better INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
  }

  /**
   * テーブルを閉じる
   */
  public close(): void {
    this.db.close();
  }
}

export default DatabaseManager;