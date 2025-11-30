"""
Health check endpoints
"""
from fastapi import APIRouter, HTTPException
from database_client import DatabaseClient


router = APIRouter(prefix="/user-settings", tags=["user-settings"])


@router.get("")
def user_settings(id: int):
    """Get user settings data from the database"""
    # Create database client
    db_client = DatabaseClient()
    
    try:
        # Connect to database
        if not db_client.connect():
            raise HTTPException(status_code=500, detail="Failed to connect to database")
        
        # Get user settings
        settings = db_client.get_user_settings(id)
        
        if settings is None:
            raise HTTPException(status_code=404, detail=f"User settings with id {id} not found")
        
        return settings

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving user settings: {str(e)}")
    
    finally:
        # Always disconnect
        db_client.disconnect()
