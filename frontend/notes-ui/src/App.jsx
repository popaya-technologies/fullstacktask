import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NoteForm from './components/NoteForm';

function App() {
  return (
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<NoteForm />} />
        <Route path="/edit/:id" element={<NoteForm />} />
      </Routes>
  
  );
}
export default App;