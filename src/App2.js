import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import CardList from './components/CardList';
import Details from './components/Details';

function App2() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<CardList />} />
                <Route path="/details/:id" element={<Details />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App2;
