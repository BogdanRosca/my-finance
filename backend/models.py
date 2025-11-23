"""
Pydantic models for request/response validation
"""
from pydantic import BaseModel
from datetime import date as date_type

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
    