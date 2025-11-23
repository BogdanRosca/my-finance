"""
Database client for the My Finance application.
Handles all database connections and operations.
"""
from dotenv import load_dotenv
from typing import Optional, List, Dict, Any
import os
import psycopg2


load_dotenv()


class DatabaseClient:
    """Client for database operations"""
    
    def __init__(self, host: Optional[str] = None, port: Optional[str] = None, 
                 database: Optional[str] = None, user: Optional[str] = None, 
                 password: Optional[str] = None):
        """Initialize database client with connection parameters"""
        self.host = host or os.getenv("PGHOST")
        self.port = port or os.getenv("PGPORT")
        self.database = database or os.getenv("PGDATABASE")
        self.user = user or os.getenv("POSTGRES_USER")
        self.password = password or os.getenv("POSTGRES_PASSWORD")
        self._connection = None
    
    def connect(self):
        """Establish connection to the database"""
        try:
            self._connection = psycopg2.connect(
                host=self.host,
                port=self.port,
                database=self.database,
                user=self.user,
                password=self.password
            )
            return True
        except Exception as e:
            print(f"Error connecting to database: {e}")
            return False
    
    def disconnect(self):
        """Close database connection"""
        if self._connection:
            self._connection.close()
            self._connection = None
    
    def is_connected(self) -> bool:
        """Check if database connection is active"""
        if not self._connection:
            return False
        try:
            cursor = self._connection.cursor()
            cursor.execute("SELECT 1")
            cursor.close()
            return True
        except psycopg2.Error:
            return False

    def get_overview(self) -> List[Dict[str, Any]]:
        """Get all overview data from the database"""
        if not self.is_connected():
            raise Exception("Not connected to database")
        
        cursor = self._connection.cursor()
        try:
            cursor.execute("SELECT * FROM overview")
            columns = [desc[0] for desc in cursor.description]
            rows = cursor.fetchall()
            return [dict(zip(columns, row)) for row in rows]
        finally:
            cursor.close()