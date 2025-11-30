"""
Pydantic models for request/response validation
"""
from pydantic import BaseModel
from datetime import date as date_type
from typing import Optional

class Overview(BaseModel):
    date: date_type
    income: int
    expenses: int
    investment: int
    savings: int
    kutxa_cash: int
    kutxa_etf: int
    degiro: int
    revolut: int
    crypto: int

class UserSettingsUpdate(BaseModel):
    emergency_budget: Optional[int] = None
    peace_of_mind_budget: Optional[int] = None
    