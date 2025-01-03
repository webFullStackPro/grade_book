import React from 'react';
import {useTranslation} from "react-i18next";
import weixinqrcode from '@/assets/weixinqrcode_small.jpg'

const Home: React.FC = () => {
  const { t } = useTranslation();
  const homeStyle = {
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    fontSize: '22px',
    marginTop: 10
  }

  return (
    <>
      <div style={homeStyle}>{t('welcomeMessage')}</div>
      <div style={homeStyle}>{t('ad1')}</div>
      <div style={homeStyle}>{t('ad2')}</div>
      <div style={homeStyle}>{t('ad3')}</div>
      <div style={homeStyle}><img src={weixinqrcode} alt={t('weixinAlt')}/></div>
    </>
  )
};

export default Home;