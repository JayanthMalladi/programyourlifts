import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Program from './pages/Program';
import Workout from './pages/Workout';
import Progress from './pages/Progress';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/program" element={<Program />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
