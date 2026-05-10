import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import PlayerPage from './pages/PlayerPage.jsx';
import RootDataDraftPage from './pages/RootDataDraftPage.jsx';
import RootDataPage from './pages/RootDataPage.jsx';
import MyRootDataPage from './pages/MyRootDataPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/root-data-draft" element={<RootDataDraftPage />} />
      <Route path="/root-data" element={<RootDataPage />} />
      <Route path="/player" element={<PlayerPage />} />
      <Route path="/my-root-data" element={<MyRootDataPage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default App;
