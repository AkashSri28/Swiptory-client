import './App.css';
import BookmarkPage from './pages/BookmarkPage/BookmarkPage';
import Home from './pages/Home/Home';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/authContext';
import PublicStory from './pages/PublicStory/PublicStory';


function App() {
  const {isLoggedIn} = useAuth();

  return (
    <Router>
       <div className="App">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/bookmarks" element={<BookmarkPage/>} />
            <Route path="/story/:id" element={<PublicStory/>} />
          </Routes>
        </div>
    </Router>
   
  );  
}

export default App;
