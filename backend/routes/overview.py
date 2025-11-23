"""
Overview data endpoints
"""
from fastapi import APIRouter, HTTPException
from typing import List
from database_client import DatabaseClient
from models import Overview


router = APIRouter(prefix="/overview", tags=["overview"])


@router.get("", response_model=List[Overview])
def get_overview():
    """Get overview financial data from the database"""
    # Create database client
    db_client = DatabaseClient()
    
    try:
        # Connect to database
        if not db_client.connect():
            raise HTTPException(status_code=500, detail="Failed to connect to database")
        
        # Get all data
        return db_client.get_overview()

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving overview data: {str(e)}")
    
    finally:
        # Always disconnect
        db_client.disconnect()
