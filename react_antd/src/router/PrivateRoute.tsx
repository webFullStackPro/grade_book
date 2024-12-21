// import React from 'react';
// import { Navigate } from 'react-router-dom';
//
// // 定义 PrivateRoute 的 props 类型
// interface PrivateRouteProps {
//   element: React.ReactElement;
// }
//
// const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
//   const loginToken:string|null = sessionStorage.getItem('loginToken');
//   const isAuthenticated = !!(loginToken && loginToken != '');
//   return isAuthenticated ? element : <Navigate to="/login" />;
// };
//
// export default PrivateRoute;


import React from 'react';
import {useLocation, Navigate} from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactNode; // 你可以根据实际需要调整这里的类型
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const loginToken:string|null = sessionStorage.getItem('loginToken');
  const isAuthenticated = !!(loginToken && loginToken != '');

  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/Login" state={{ from: location }} replace />
  }

  return element;
};

export default PrivateRoute;