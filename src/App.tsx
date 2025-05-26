import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import './App.css'
import Test from './pages/Test'
import Terms from './pages/Terms'
import Home from './pages/Home'
import RegisterClass from './pages/RegisterClass'
import RegisterUser from './pages/RegisterUser'
import Admin from './pages/Admin'
import Area from './pages/Area'
import Classes from './pages/Classes'

function App() {


  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/test" element={<Test />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/home" element={<Home />} />
          <Route path="/registerClass" element={<RegisterClass />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/area" element={<Area />} />
          <Route path="/clases" element={<Classes />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
