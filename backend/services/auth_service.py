import bcrypt
import jwt
from datetime import datetime, timedelta
from database.models import User
from database.db_client import db_client

class AuthService:
    def __init__(self):
        self.secret_key = "your-secret-key"  # In production, use env var
        self.collection = db_client.get_collection("users")
    
    def hash_password(self, password: str) -> str:
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def verify_password(self, password: str, hashed: str) -> bool:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    def create_user(self, username: str, email: str, password: str) -> User:
        if self.collection.find_one({"$or": [{"username": username}, {"email": email}]}):
            raise ValueError("User already exists")
        
        user = User(
            user_id=f"user_{datetime.now().timestamp()}",
            username=username,
            email=email,
            password_hash=self.hash_password(password)
        )
        
        self.collection.insert_one(user.dict())
        return user
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        user_data = self.collection.find_one({"email": email})
        if not user_data:
            return None
        
        user = User(**user_data)
        if self.verify_password(password, user.password_hash):
            return user
        return None
    
    def create_token(self, user: User) -> str:
        payload = {
            "user_id": user.user_id,
            "username": user.username,
            "exp": datetime.utcnow() + timedelta(days=7)
        }
        return jwt.encode(payload, self.secret_key, algorithm="HS256")
    
    def verify_token(self, token: str) -> Optional[User]:
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=["HS256"])
            user_data = self.collection.find_one({"user_id": payload["user_id"]})
            return User(**user_data) if user_data else None
        except jwt.PyJWTError:
            return None

auth_service = AuthService()
