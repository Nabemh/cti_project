from fastapi import FastAPI
from app.database import engine
from app import models
from app.agent import run_agent
from app.routers import router
from apscheduler.schedulers.asyncio import AsyncIOScheduler

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CTI System")
app.include_router(router)

scheduler = AsyncIOScheduler()

@app.on_event("startup")
async def startup():
    scheduler.add_job(run_agent, "interval", seconds=60)
    scheduler.start()
    print("[Scheduler] Agent started — runs every 60 seconds.")

@app.on_event("shutdown")
async def shutdown():
    scheduler.shutdown()

@app.get("/")
def root():
    return {"status": "CTI System running"}

@app.get("/run-agent")
async def trigger_agent():
    await run_agent()
    return {"status": "Agent run complete"}