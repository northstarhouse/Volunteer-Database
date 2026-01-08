import React from 'react';
import VolunteerPortal from './VolunteerPortal.jsx';

const App = () => {
  const apiUrl =
    import.meta.env.VITE_SHEETS_API_URL ||
    'https://script.google.com/macros/s/AKfycbyfPvK6_dfAUIQaAkGvomxXlLqAEUnZXpsprnbj_E_yhSIN162OAUYiJueYu01TykNhdg/exec';
  return <VolunteerPortal apiUrl={apiUrl} />;
};

export default App;
