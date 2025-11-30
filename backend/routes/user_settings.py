"""
Endpoints for retrieving and updating user settings.
"""
from fastapi import APIRouter, HTTPException
from database_client import DatabaseClient
from models import UserSettingsUpdate


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


@router.put("")
def update_user_settings(id: int, settings_update: UserSettingsUpdate):
    """Update user settings in the database"""
    # Create database client
    db_client = DatabaseClient()
    
    try:
        # Connect to database
        if not db_client.connect():
            raise HTTPException(status_code=500, detail="Failed to connect to database")
        
        # Update user settings
        updated_settings = db_client.update_user_settings(
            user_id=id,
            emergency_budget=settings_update.emergency_budget,
            peace_of_mind_budget=settings_update.peace_of_mind_budget
        )
        
        if updated_settings is None:
            raise HTTPException(status_code=404, detail=f"User settings with id {id} not found")
        
        return updated_settings

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating user settings: {str(e)}")
    
    finally:
        # Always disconnect
        db_client.disconnect()
