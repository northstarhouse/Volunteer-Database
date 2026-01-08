import React from 'react';
import VolunteerPortal from './VolunteerPortal.jsx';

const App = () => {
  const apiUrl = import.meta.env.VITE_SHEETS_API_URL || '';
  return <VolunteerPortal apiUrl={apiUrl} />;
};

export default App;
