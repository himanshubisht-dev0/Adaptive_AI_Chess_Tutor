import requests
import json
from typing import Optional
from cache.cache_manager import cache_manager

class OllamaClient:
    def __init__(self, base_url: str = "http://localhost:11434", model: str = "mistral"):
        self.base_url = base_url
        self.model = model
    
    def query_ollama(self, prompt: str, max_tokens: int = 500) -> Optional[str]:
        """Query Ollama model with caching"""
        cache_key = cache_manager.generate_cache_key(hash(prompt), "ollama_response")
        cached_response = cache_manager.get(cache_key)
        
        if cached_response:
            return cached_response
        
        try:
            response = requests.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "num_predict": max_tokens
                    }
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                response_text = result.get("response", "").strip()
                
                # Cache the response
                cache_manager.set(cache_key, response_text, expire_seconds=86400)  # 24 hours
                
                return response_text
            else:
                print(f"Ollama API error: {response.status_code} - {response.text}")
                return None
                
        except requests.exceptions.RequestException as e:
            print(f"Error connecting to Ollama: {e}")
            return None
    
    def explain_move(self, fen: str, move: str, context: str = "") -> str:
        """Generate human-readable explanation for a chess move"""
        prompt = f"""
        You are an expert chess tutor. Explain the move {move} in the position {fen}.
        
        Context: {context}
        
        Provide a concise, educational explanation focusing on:
        1. The tactical or strategic purpose of the move
        2. What threats it creates or prevents
        3. How it improves the position
        4. Any potential alternatives and why this move is better
        
        Keep the explanation beginner-friendly but insightful.
        """
        
        explanation = self.query_ollama(prompt)
        return explanation or "Unable to generate explanation at this time."
    
    def suggest_improvement(self, fen: str, user_move: str, best_move: str) -> str:
        """Suggest improvement when user makes a suboptimal move"""
        prompt = f"""
        You are a chess coach. The user played {user_move} in position {fen}, 
        but the best move was {best_move}. 
        
        Explain:
        1. Why the user's move is not optimal
        2. The advantages of the best move
        3. What the user should look for in similar positions
        
        Be encouraging and constructive in your feedback.
        """
        
        return self.query_ollama(prompt) or "Good effort! Consider analyzing this position further."

# Global Ollama client
ollama_client = OllamaClient()
