from fastapi import FastAPI
from services.user_service import UserService

app = FastAPI()
user_service = UserService()

@app.get("/users")
def get_users():
    return user_service.get_all_users()

@app.post("/users")
def create_user(name: str, email: str):
    user_service.add_user({"name": name, "email": email})
    return {"message": "User created successfully"}
