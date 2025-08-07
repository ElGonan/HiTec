import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import './App.css'
// import Test from './pages/Test'
import Home from './pages/Home'
import RegisterClass from './pages/RegisterClass'
import RegisterUser from './pages/RegisterUser'
import Admin from './pages/Admin'
import Area from './pages/Area'
import Classes from './pages/Classes'
import Schedule from './pages/Schedule'
import { UserProvider } from './hooks/useUserContext'

function App() {

  return (
    <>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            {/* <Route path="/test" element={<Test />} /> */}
            <Route path="/home" element={<Home />} />
            <Route path="/registerClass" element={<RegisterClass />} />
            <Route path="/register" element={<RegisterUser />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/area" element={<Area />} />
            <Route path="/clases" element={<Classes />} />
            <Route path="/schedule" element={<Schedule />}/>
          </Routes>
        </Router>
      </UserProvider>
    </>
  )
}

export default App
