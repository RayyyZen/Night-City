import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import MyProfile from './pages/MyProfile'
import Profile from './pages/Profile'
import VerifyCode from './pages/VerifyCode'
import Register from './pages/Register'
import Buildings from './pages/Buildings'
import Building from './pages/Building'
import MyBuilding from './pages/MyBuilding'
import CreateBuilding from './pages/CreateBuilding'
import JoinBuilding from './pages/JoinBuilding'
import About from './pages/About.jsx';

import News from './pages/News'
import AllNews from './pages/AllNews'
import CreateDevice from './pages/CreateDevice'
import Device from './pages/Device'
import PublishNews from './pages/PublishNews'
import Admin from './pages/Admin'

function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/myprofile" element={<MyProfile />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      <Route path="/register" element={<Register />} />
      <Route path="/buildings" element={<Buildings />} />
      <Route path="/building/:id" element={<Building />} />
      <Route path="/mybuilding" element={<MyBuilding />} />
      <Route path="/create-building" element={<CreateBuilding />} />
      <Route path="/join-building/:id" element={<JoinBuilding />} />

      <Route path="/news/:id" element={<News />} />
      <Route path="/all-news" element={<AllNews />} />
      <Route path="/create-device" element={<CreateDevice />} />
      <Route path="/device/:id" element={<Device />} />
      <Route path="/publish-news" element={<PublishNews />} />
      <Route path="/about" element={<About />} />

      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}

export default App