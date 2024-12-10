import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import UserVerification from './UserVerification';
import QuestionManagement from './QuestionManagement';
import ReferenceManagement from './ReferenceManagement';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={AdminLogin} />
        <Route path="/dashboard" component={AdminDashboard} />
        <Route path="/user-verification" component={UserVerification} />
        <Route path="/upload-questions" component={QuestionManagement} />
        <Route path="/manage-references" component={ReferenceManagement} />
      </Switch>
    </Router>
  );
};

export default App;
