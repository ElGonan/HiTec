import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import './App.css'
import Test from './pages/Test'
import Terms from './pages/Terms'


function App() {


  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="test" element={<Test />} />
          <Route path="terms" element={<Terms />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
