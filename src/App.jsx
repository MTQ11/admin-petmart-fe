import logo from './logo.svg';
import './App.css';
import Header from './component/header/header';
import Footer from './component/footer/footer';
import { Outlet } from 'react-router-dom';
import Sidebar from './component/sidebar/sidebar';

function App() {

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
