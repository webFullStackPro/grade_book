import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './pages/Login';
import StudentRegister from './pages/StudentRegister';
import TeacherRegister from './pages/TeacherRegister';
import PrivateRoute from '@/router/PrivateRoute';
import MainLayout from "@/components/MainLayout";
import { ConfigProvider, App as AntdApp } from 'antd';
import {I18nextProvider, useTranslation} from 'react-i18next';
import i18n from './i18n'

const App: React.FC = () => {
  const { t } = useTranslation();
  document.title = t('title')
  return (
    <I18nextProvider i18n={i18n}>
    <ConfigProvider
      theme={{
        token: {
          // Seed Token，影响范围大
          colorPrimary: '#006400',
          // 派生变量，影响范围小
          // colorBgContainer: '#f6ffed',
        },
        components: {
          Button: {
            /* 这里是你的组件 token */
            contentFontSize: 12,
            // paddingInline: 12,
            borderRadius: 4,
            defaultShadow: 'none',
            primaryShadow: 'none'
          },
          Table: {
            headerColor: 'rgb(144, 147, 153, 0.88)',
            cellFontSizeSM: 13,
          }
        },
      }}
    >
      <AntdApp>
        <Router basename={import.meta.env.VITE_PUBLIC_PATH || '/'}>
          <Routes>
            <Route path="/Login" element={<Login />} key="Login" />
            <Route path="/StudentRegister" element={<StudentRegister />} key="StudentRegister" />
            <Route path="/TeacherRegister" element={<TeacherRegister />} key="TeacherRegister" />
            <Route path="/*" element={ <PrivateRoute element={<MainLayout/>} /> } key="main"/>
          </Routes>
        </Router>
      </AntdApp>
    </ConfigProvider>
    </I18nextProvider>
  )
};

export default App;