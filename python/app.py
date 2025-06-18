from fastapi import FastAPI
from pydantic import BaseModel
from services.user_service import UserService

app = FastAPI()
user_service = UserService()

class User(BaseModel):
    name: str
    email: str

@app.get("/users")
def get_users():
    return user_service.get_all_users()

@app.post("/users")
def create_user(user: User):
    user_service.add_user(user.dict())
    return {"message": "User created successfully"}
