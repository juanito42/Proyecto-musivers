import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import EventsPage from './pages/EventsPage';
import Map from './pages/Map';
import Forums from './pages/Forums';
import CreateForum from './components/CreateForum';
import Users from './pages/Users';
import Profile from './pages/Profile'; 
import AuthForm from './components/AuthForm'; 
import RegisterForm from './components/RegisterForm';
import CategoryPage from './pages/CategoryPage'; 
import CreateEventForm from './components/CreateEventForm'; 

function App() {
  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', color: 'white' }}>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/new" element={<CreateEventForm />} />
          <Route path="/map" element={<Map />} />
          <Route path="/forums" element={<Forums />} />
          <Route path="/forums/new" element={<CreateForum />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/users" element={<Users />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/category/:category" element={<CategoryPage />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
