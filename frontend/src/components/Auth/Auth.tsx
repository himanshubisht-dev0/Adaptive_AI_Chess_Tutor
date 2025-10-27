import React, { useState } from 'react';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';

interface AuthProps {
  onSignIn: (user: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ onSignIn }) => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">♟️ Chess Master Pro</h1>
          <p className="text-gray-300">Sign in to continue your chess journey</p>
        </div>
        
        {isSignIn ? (
          <SignIn 
            onSignIn={onSignIn} 
            onSwitchToSignUp={() => setIsSignIn(false)} 
          />
        ) : (
          <SignUp 
            onSignUp={onSignIn} 
            onSwitchToSignIn={() => setIsSignIn(true)} 
          />
        )}
      </div>
    </div>
  );
};
