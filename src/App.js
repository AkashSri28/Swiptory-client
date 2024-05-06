import './App.css';
import BookmarkPage from './pages/BookmarkPage/BookmarkPage';
import Home from './pages/Home/Home';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/authContext';
import PublicStory from './pages/PublicStory/PublicStory';
import YourStories from './pages/YourStories/YourStories';


function App() {
  const {isLoggedIn} = useAuth();

  console.log(isLoggedIn)

  return (
    <Router>
       <div className="App">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/your-stories" element={isLoggedIn?<YourStories/> : <Navigate to="/"/> } />
            <Route path="/bookmarks" element={isLoggedIn?<BookmarkPage/> : <Navigate to="/"/> } />
            <Route path="/story/:id" element={<PublicStory/>} />
          </Routes>
        </div>
    </Router>
   
  );  
}

export default App;
