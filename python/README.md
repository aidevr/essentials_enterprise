# Python OOP API Example

This is a simple Python API application demonstrating Object-Oriented Programming (OOP) concepts. The application uses FastAPI for the API, a PostgreSQL database, and Docker for containerization.

## Features
- **Models**: Encapsulates data and behavior (e.g., `User` model).
- **Services**: Business logic layer (e.g., `UserService`).
- **API**: Exposes endpoints for interacting with the application.

## Prerequisites
- Python 3.9+
- Docker
- PostgreSQL

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd python
```

### 2. Create a Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Application
```bash
uvicorn app:app --reload
```

The application will be available at `http://127.0.0.1:8000`.

### 5. Run with Docker
1. Build the Docker image:
   ```bash
   docker build -t python-oop-api .
   ```
2. Run the Docker container:
   ```bash
docker run -it -p 8000:8000 python-oop-api 
   ```
### Run container with a name

      ```bash
docker run --name python-oop-api -it -p 8000:8000 python-oop-api 
   ```


### API Endpoints

#### 1. Get All Users
```bash
curl -X GET http://127.0.0.1:8000/users
```

#### 2. Create a New User
```bash
curl -X POST http://127.0.0.1:8000/users \
-H "Content-Type: application/json" \
-d '{"name": "John Doe", "email": "john.doe@example.com"}'
```
