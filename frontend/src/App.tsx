import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Practice } from './pages/Practice';
import { VsStockfish } from './pages/VsStockfish';
import { Puzzles } from './pages/Puzzles';
import { Profile } from './pages/Profile';
import { Auth } from './components/Auth/Auth';

function App() {
  const [user, setUser] = React.useState(null);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/vs-stockfish" element={<VsStockfish />} />
          <Route path="/puzzles" element={<Puzzles />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth" element={<Auth onSignIn={setUser} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
