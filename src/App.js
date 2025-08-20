import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import CardList from './components/CardList';
import Details from './components/Details';
import ScrollToTop from './components/ScrollToTop';
import PageNotFound from './components/PageNotFound';

function App() {
    return (
        <>
            <ScrollToTop />
            <Header />
            <Routes>
                <Route path="/" element={<CardList />} />
                <Route path="/details/:id" element={<Details />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
