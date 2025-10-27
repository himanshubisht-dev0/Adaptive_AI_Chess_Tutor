import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from typing import Tuple, List, Dict
from enum import Enum

class Action(Enum):
    INCREASE_DIFFICULTY = 0
    DECREASE_DIFFICULTY = 1
    MAINTAIN_DIFFICULTY = 2
    PROVIDE_HINT = 3
    NO_HINT = 4

class ChessRLAgent(nn.Module):
    def __init__(self, state_dim: int = 5, action_dim: int = 5, hidden_dim: int = 64):
        super(ChessRLAgent, self).__init__()
        
        self.policy_network = nn.Sequential(
            nn.Linear(state_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, action_dim),
            nn.Softmax(dim=-1)
        )
        
        self.value_network = nn.Sequential(
            nn.Linear(state_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, 1)
        )
        
        self.optimizer = optim.Adam(self.parameters(), lr=0.001)
        self.gamma = 0.99  # Discount factor
        
    def forward(self, state: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        action_probs = self.policy_network(state)
        state_value = self.value_network(state)
        return action_probs, state_value
    
    def select_action(self, state: np.ndarray) -> Action:
        state_tensor = torch.FloatTensor(state).unsqueeze(0)
        action_probs, _ = self.forward(state_tensor)
        
        action_dist = torch.distributions.Categorical(action_probs)
        action = action_dist.sample()
        
        return Action(action.item())
    
    def update_policy(self, rewards: List[float], states: List[np.ndarray], 
                     actions: List[int], log_probs: List[torch.Tensor]) -> float:
        returns = []
        R = 0
        
        # Calculate discounted returns
        for r in rewards[::-1]:
            R = r + self.gamma * R
            returns.insert(0, R)
        
        returns = torch.FloatTensor(returns)
        returns = (returns - returns.mean()) / (returns.std() + 1e-8)
        
        states = torch.FloatTensor(states)
        actions = torch.LongTensor(actions)
        log_probs = torch.stack(log_probs)
        
        # Calculate advantages
        _, state_values = self.forward(states)
        advantages = returns - state_values.squeeze()
        
        # Policy loss
        policy_loss = -(log_probs * advantages.detach()).mean()
        
        # Value loss
        value_loss = advantages.pow(2).mean()
        
        # Total loss
        loss = policy_loss + 0.5 * value_loss
        
        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()
        
        return loss.item()

class AdaptiveTutor:
    def __init__(self):
        self.agent = ChessRLAgent()
        self.user_history = {}
    
    def get_state(self, user_id: str) -> np.ndarray:
        """Get current state representation for RL agent"""
        history = self.user_history.get(user_id, {
            'accuracy': 0.5,
            'response_time': 30.0,
            'puzzle_streak': 0,
            'difficulty_level': 0.0,  # 0-1 scale
            'improvement_rate': 0.0
        })
        
        return np.array([
            history['accuracy'],
            min(history['response_time'] / 60.0, 1.0),  # Normalize to 0-1
            min(history['puzzle_streak'] / 10.0, 1.0),  # Normalize streak
            history['difficulty_level'],
            history['improvement_rate']
        ])
    
    def calculate_reward(self, user_id: str, correct: bool, time_taken: float, 
                        difficulty: float) -> float:
        """Calculate reward based on user performance"""
        reward = 0.0
        
        if correct:
            reward += 1.0
            # Bonus for faster correct solutions
            if time_taken < 30.0:  # Under 30 seconds
                reward += 0.5
        else:
            reward -= 0.5
        
        # Reward for appropriate difficulty level
        expected_time = 60.0 * (1.0 - difficulty) + 10.0  # Scale with difficulty
        time_diff = abs(time_taken - expected_time)
        if time_diff < 15.0:
            reward += 0.3
        
        return reward
    
    def decide_action(self, user_id: str, correct: bool, time_taken: float) -> Action:
        """Decide tutor action based on current state"""
        state = self.get_state(user_id)
        action = self.agent.select_action(state)
        
        # Update user history
        self.update_user_history(user_id, correct, time_taken)
        
        return action
    
    def update_user_history(self, user_id: str, correct: bool, time_taken: float):
        """Update user performance history"""
        if user_id not in self.user_history:
            self.user_history[user_id] = {
                'accuracy': 0.5,
                'response_time': 30.0,
                'puzzle_streak': 0,
                'difficulty_level': 0.0,
                'improvement_rate': 0.0,
                'total_attempts': 0,
                'correct_attempts': 0
            }
        
        history = self.user_history[user_id]
        history['total_attempts'] += 1
        
        if correct:
            history['correct_attempts'] += 1
            history['puzzle_streak'] += 1
        else:
            history['puzzle_streak'] = 0
        
        # Update accuracy (moving average)
        new_accuracy = history['correct_attempts'] / history['total_attempts']
        history['accuracy'] = 0.9 * history['accuracy'] + 0.1 * new_accuracy
        
        # Update response time (moving average)
        history['response_time'] = 0.9 * history['response_time'] + 0.1 * time_taken

# Global adaptive tutor
adaptive_tutor = AdaptiveTutor()
