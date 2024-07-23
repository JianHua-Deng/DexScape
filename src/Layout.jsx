import { Outlet } from 'react-router-dom';
import Header from './components/header/Header'

import './Layout.css'

function Layout() {
  return (
    <>
      <Header />
      <div className='main-contents'>
        <Outlet />
      </div>
    </>
  );
}

export default Layout;