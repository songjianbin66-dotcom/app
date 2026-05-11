import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import PlayerPage from './pages/PlayerPage.jsx';
import RootDataDraftPage from './pages/RootDataDraftPage.jsx';
import RootDataPage from './pages/RootDataPage.jsx';
import MyRootDataPage from './pages/MyRootDataPage.jsx';
import WalletPage from './pages/WalletPage.jsx';
import AccountOpeningPage from './pages/AccountOpeningPage.jsx';
import RootDataSubmitSuccessPage from './pages/RootDataSubmitSuccessPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/root-data-draft" element={<RootDataDraftPage />} />
      <Route path="/root-data" element={<RootDataPage />} />
      <Route path="/root-data-submit-success" element={<RootDataSubmitSuccessPage />} />
      <Route path="/player" element={<PlayerPage />} />
      <Route path="/my-root-data" element={<MyRootDataPage />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/account-opening" element={<AccountOpeningPage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default App;
