import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateInvoice from './pages/CreateInvoice';
import EditInvoice from './pages/EditInvoice';
import Settings from './pages/Settings';
import InvoicePreview from './pages/InvoicePreview';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/preview" element={<InvoicePreview />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="create" element={<CreateInvoice />} />
            <Route path="edit/:id" element={<EditInvoice />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;