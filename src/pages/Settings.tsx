import React from 'react';
import { useApp } from '../context/AppContext';
import BusinessInfoForm from '../components/BusinessInfoForm';

const Settings: React.FC = () => {
  const { businessInfo, updateBusinessInfo } = useApp();

  const handleSave = (info: any) => {
    updateBusinessInfo(info);
    alert('Business information saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your business information and preferences.</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <BusinessInfoForm
          businessInfo={businessInfo || undefined}
          onChange={handleSave}
        />
      </div>
    </div>
  );
};

export default Settings;