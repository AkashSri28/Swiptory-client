import './App.css';
import BookmarkPage from './pages/BookmarkPage/BookmarkPage';
import Home from './pages/Home/Home';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicStory from './pages/PublicStory/PublicStory';
import YourStories from './pages/YourStories/YourStories';
import { useEffect, useState } from 'react';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in
    const token = localStorage.getItem('token'); // Assuming you store the token in local storage
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  console.log(isLoggedIn);

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
