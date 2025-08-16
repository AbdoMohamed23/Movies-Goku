import { Route, Routes } from 'react-router-dom';
import './App.css';
import Search from './components/Search';
import App2 from './App2';

function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<App2 />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </>
  );
}

export default App;
