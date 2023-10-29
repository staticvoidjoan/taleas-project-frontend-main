import React from 'react';
import logo from './logo-removebg-preview.png'
import { useTranslation } from 'react-i18next';

const OfflinePage = () => {
  const {t} = useTranslation(["Translate"])
  return (
    <div className="offline-fallback">
      <img className = 'offline-logo' src={logo} alt='app logo' />
      <div className='description'>
      <h2>{t("offline")}</h2>
      <p>Please check your internet connection and try again.</p>
      <button className='reload-button' onClick={() => window.location.reload()}>Retry</button>
    </div>
    </div>
  );
};

export default OfflinePage;