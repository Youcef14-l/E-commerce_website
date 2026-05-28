import './App.css'
import { Routes, Route } from "react-router-dom"; 

import LandingPage from './pages/LandingPage'; 
import About from './pages/About'; 
import Products from './pages/Products'; 

function App() {
 

  return (
    <>
   <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/products" element={<Products />} />
    </Routes>
    </>
  )
}

export default App
