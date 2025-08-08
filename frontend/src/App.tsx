import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './App.css'
import { Provider } from 'react-redux'
import { store } from './store'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './components/Pages/Dashboard'

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <div className="App">
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </div>
      </AuthProvider>
    </Provider>
  )
}

export default App
