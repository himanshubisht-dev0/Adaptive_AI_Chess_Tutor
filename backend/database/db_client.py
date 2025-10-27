import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv

load_dotenv()

class MongoDBClient:
    def __init__(self):
        self.connection_string = os.getenv("MONGODB_ATLAS_URI", "mongodb://localhost:27017")
        self.database_name = "chess_tutor"
        self.client = None
        self.db = None
        
    def connect(self):
        try:
            self.client = MongoClient(self.connection_string)
            self.db = self.client[self.database_name]
            # Test connection
            self.client.admin.command('ping')
            print("Successfully connected to MongoDB!")
        except ConnectionFailure as e:
            print(f"Failed to connect to MongoDB: {e}")
            raise
    
    def get_collection(self, collection_name):
        if not self.db:
            self.connect()
        return self.db[collection_name]
    
    def close(self):
        if self.client:
            self.client.close()

# Singleton instance
db_client = MongoDBClient()
