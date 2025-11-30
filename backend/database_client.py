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
            cursor.execute("SELECT * FROM overview ORDER BY date DESC")
            columns = [desc[0] for desc in cursor.description]
            rows = cursor.fetchall()
            return [dict(zip(columns, row)) for row in rows]
        finally:
            cursor.close()

    def get_user_settings(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get user settings from the database for a specific user"""
        if not self.is_connected():
            raise Exception("Not connected to database")
        
        cursor = self._connection.cursor()
        try:
            cursor.execute(
                "SELECT id, name, emergency_budget, peace_of_mind_budget FROM user_settings WHERE id = %s",
                (user_id,)
            )
            columns = [desc[0] for desc in cursor.description]
            row = cursor.fetchone()
            return dict(zip(columns, row)) if row else None
        finally:
            cursor.close()

    def update_user_settings(self, user_id: int, emergency_budget: Optional[int] = None, 
                            peace_of_mind_budget: Optional[int] = None) -> Optional[Dict[str, Any]]:
        """Update user settings in the database"""
        if not self.is_connected():
            raise Exception("Not connected to database")
        
        # Build dynamic update query based on provided fields
        update_fields = []
        params = []
        
        if emergency_budget is not None:
            update_fields.append("emergency_budget = %s")
            params.append(emergency_budget)
        
        if peace_of_mind_budget is not None:
            update_fields.append("peace_of_mind_budget = %s")
            params.append(peace_of_mind_budget)
        
        if not update_fields:
            # Nothing to update, return current settings
            return self.get_user_settings(user_id)
        
        params.append(user_id)
        query = "UPDATE user_settings SET " + ", ".join(update_fields) + " WHERE id = %s RETURNING id, name, emergency_budget, peace_of_mind_budget"
        
        cursor = self._connection.cursor()
        try:
            cursor.execute(query, params)
            self._connection.commit()
            columns = [desc[0] for desc in cursor.description]
            row = cursor.fetchone()
            return dict(zip(columns, row)) if row else None
        finally:
            cursor.close()