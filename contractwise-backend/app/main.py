from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import auth, contracts, queries
from app.db import supabase
from fastapi import Depends

app = FastAPI(title="Contracts SaaS API")

# ----- Add CORS -----
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ change to ["https://your-frontend.vercel.app"] in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----- Routers -----
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(contracts.router, prefix="/contracts", tags=["Contracts"])
app.include_router(queries.router, prefix="/ask", tags=["Queries"])

@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.get("/db-check")
def db_check():
    try:
        res = supabase.table("users").select("*").limit(1).execute()
        return {"connected": True, "data": res.data}
    except Exception as e:
        return {"connected": False, "error": str(e)}

# For Vercel
# handler = app
