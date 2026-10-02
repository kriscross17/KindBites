/**
 * Database Connection and Query Management
 * Provides connection pooling, transaction support, and error handling
 */

import mysql from 'mysql2/promise';
import { getDatabaseConfig } from './config';
import { ConfigurationError } from './configurationError';
import { DatabaseError, parseDatabaseError } from './errors';
import { logError, logInfo, logDebug } from './logger';

let pool: mysql.Pool | null = null;

/**
 * Get or create database connection pool
 */
export async function getDbConnection(): Promise<mysql.Pool> {
  if (!pool) {
    const dbConfig = getDatabaseConfig();
    try {
      pool = mysql.createPool(dbConfig);
      logInfo('Database connection pool created', { 
        connectionLimit: dbConfig.connectionLimit 
      });
    } catch (error) {
      logError('Failed to create database connection pool', { error });
      throw new DatabaseError('Failed to create database connection pool');
    }
  }
  return pool;
}

/**
 * Test and ensure connection is alive
 */
export async function ensureConnection(): Promise<mysql.Pool> {
  try {
    const currentPool = await getDbConnection();
    // Test the connection with a simple query
    await currentPool.execute('SELECT 1');
    return currentPool;
  } catch (error) {
    if (error instanceof ConfigurationError) throw error;
    logError('Connection test failed, recreating pool', { error });
    // Reset the pool and try again
    pool = null;
    return await getDbConnection();
  }
}


/**
 * Execute query with retry logic and error handling
 */
export async function executeQuery<T = any>(
  query: string, 
  params: any[] = [], 
  retries: number = 3
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const currentPool = await ensureConnection();
      const [results] = await currentPool.execute(query, params);
      
      logDebug('Query executed successfully', { 
        attempt, 
        query: query.substring(0, 100) 
      });
      
      return results as T;
    } catch (error: any) {
      lastError = error;

      if (error instanceof ConfigurationError) throw error;
      
      logError(error, { 
        context: `Database query attempt ${attempt} failed`,
        query: query.substring(0, 100),
      });
      
      // Check if it's a connection-related error
      const isConnectionError = 
        error.code === 'PROTOCOL_CONNECTION_LOST' || 
        error.code === 'ECONNRESET' || 
        error.code === 'PROTOCOL_ENQUEUE_AFTER_QUIT' ||
        error.code === 'ER_CON_COUNT_ERROR' ||
        error.message?.includes('connection is in closed state') ||
        error.message?.includes('Too many connections');
      
      if (isConnectionError) {
        // Reset pool for connection errors
        pool = null;
        
        // Wait before retrying (exponential backoff)
        if (attempt < retries) {
          const waitTime = attempt * 1000;
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      } else {
        // Non-connection errors shouldn't be retried
        throw parseDatabaseError(error);
      }
    }
  }
  
  // All retries failed
  throw parseDatabaseError(lastError);
}

// Export query as an alias for backward compatibility
export const query = executeQuery;

/**
 * Begin transaction
 */
export async function beginTransaction(): Promise<mysql.PoolConnection> {
  const currentPool = await ensureConnection();
  const connection = await currentPool.getConnection();
  await connection.beginTransaction();
  return connection;
}

/**
 * Execute query within a transaction
 */
export async function executeInTransaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await beginTransaction();
  
  try {
    const result = await callback(connection);
    await connection.commit();
    logDebug('Transaction committed successfully');
    return result;
  } catch (error) {
    await connection.rollback();
    logError('Transaction rolled back', { error });
    throw parseDatabaseError(error);
  } finally {
    connection.release();
  }
}

/**
 * Helper function to gracefully close the pool
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    logInfo('Database connection pool closed');
  }
}

/**
 * Health check function
 */
export async function healthCheck(): Promise<{ healthy: boolean; timestamp: string; error?: string }> {
  try {
    await executeQuery('SELECT 1 as health_check');
    return { 
      healthy: true, 
      timestamp: new Date().toISOString() 
    };
  } catch (error) {
    logError('Database health check failed', { error });
    return { 
      healthy: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString() 
    };
  }
}
