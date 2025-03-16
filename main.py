from auth import AuthHandler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from mosip_auth_sdk.models import DemographicsModel

server = FastAPI()
auth = AuthHandler()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

server.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DemographicRequestData(BaseModel):
    uin: str

class DobRequest(DemographicRequestData):
    dob: str

@server.get("/")
async def root():
    return {"message": "Hello, MOSIP!"}


@server.post("/dob/")
async def dob(dob_data: DobRequest):
    demo_data = DemographicsModel(dob=dob_data.dob)
    auth_response = auth.yesno(dob_data.uin, demo_data)
    return {"authStatus": auth_response}
