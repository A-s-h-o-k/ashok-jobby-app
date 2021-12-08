import {Switch, Route} from 'react-router-dom'
import LogInForm from './components/LogInForm'
import Home from './components/Home'
import Jobs from './components/JobsRoute'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import JobItemDetails from './components/JobItemDetails'
import './App.css'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={LogInForm} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={Jobs} />
    <ProtectedRoute exact path="/jobs/:id" component={JobItemDetails} />
    <Route path="/bad-path" component={NotFound} />
    <Route component={NotFound} />
  </Switch>
)

export default App
