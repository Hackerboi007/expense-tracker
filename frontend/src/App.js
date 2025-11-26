import React, {useState, useMemo} from 'react'
import styled from "styled-components";
import bg from './img/bg.png'
import {MainLayout} from './styles/Layouts'
import Orb from './Components/Orb/Orb'
import Navigation from './Components/Navigation/Navigation'
import Dashboard from './Components/Dashboard/Dashboard';
import Income from './Components/Income/Income'
import Expenses from './Components/Expenses/Expenses';
import Transactions from './Components/Transactions/Transactions';
import { useGlobalContext } from './context/globalContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import Admin from './Components/Admin/Admin';

function App() {
  const [active, setActive] = useState(1)

  const { user } = useGlobalContext()

  const displayData = () => {
    switch(active){
      case 1:
        return <Dashboard />
      case 2:
        return <Transactions />
      case 3:
        return <Income />
      case 4:
        return <Expenses />
      default:
        return <Dashboard />
    }
  }

  const orbMemo = useMemo(() => {
    return <Orb />
  },[])

  return (
    <Router>
      <AppStyled bg={bg} className="App">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/" element={
            user ? (
              <MainLayout>
                {orbMemo}
                <Navigation active={active} setActive={setActive} />
                <main>
                  {displayData()}
                </main>
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/admin" element={
            user && user.role === 'admin' ? (
              <MainLayout>
                {orbMemo}
                <Navigation active={active} setActive={setActive} />
                <main>
                  <Admin />
                </main>
              </MainLayout>
            ) : (
              <Navigate to="/" />
            )
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AppStyled>
    </Router>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${props => props.bg});
  position: relative;
  main{
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar{
      width: 0;
    }
  }
`;

export default App;
