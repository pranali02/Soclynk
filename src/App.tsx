import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './components/ui/ToastNotification'
import Layout from './components/Layout'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Messages from './pages/Messages'
import Explore from './pages/Explore'
import Communities from './pages/Communities'
import Governance from './pages/Governance'
import Notifications from './pages/Notifications'
import More from './pages/More'

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="profile" element={<Profile />} />
                <Route path="messages" element={<Messages />} />
                <Route path="explore" element={<Explore />} />
                <Route path="communities" element={<Communities />} />
                <Route path="governance" element={<Governance />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="more" element={<More />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App 