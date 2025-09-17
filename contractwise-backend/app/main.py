from fastapi import FastAPI
from app import auth, contracts, queries
from app.db import supabase
from fastapi import Depends
app = FastAPI(title="Contracts SaaS API")

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(contracts.router, prefix="/contracts", tags=["Contracts"])
app.include_router(queries.router, prefix="/ask", tags=["Queries"])

@app.get("/")
def root():
    return {"message": "Backend is running"}


@app.get("/db-check")
def db_check():
    try:
        # just fetch from users table (make sure you created it in Supabase)
        res = supabase.table("users").select("*").limit(1).execute()
        return {"connected": True, "data": res.data}
    except Exception as e:
        return {"connected": False, "error": str(e)}
    
handler = app