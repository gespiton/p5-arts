import './App.css';
import BreezeOfFreedom from './breeze-of-freedom/main';
import { Route, Link, Routes, Outlet, BrowserRouter } from 'react-router-dom';
import Test from './playground/test';
import DistortedSpirit from './projects/DistortedSpirit/DistortedSpirit';
import ToBelieve from './projects/ToBelieve/ToBelieve';
import React, { useState } from 'react';
import { Button, List, ListItem, SwipeableDrawer } from '@mui/material';
import styled from 'styled-components';

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route
            path="/breeze-of-freedom"
            element={<BreezeOfFreedom />}
          ></Route>
          <Route path="/playground" element={<Test />}></Route>
          <Route path="/distorted-spirit" element={<DistortedSpirit />}></Route>
          <Route path="/to-believe" element={<ToBelieve />}></Route>
          <Route path="*" element={<h1>hi</h1>} />
          {/* <Route path="/">
          <h1>Home</h1>
        </Route> */}
        </Routes>
        <Outlet />
      </div>
    </BrowserRouter>
  );
};

const StyledButton = styled(Button)`
  padding: 20px;
  background-color: transparent;
  position: fixed;
  z-index: 100;
  color: transparent;
`;

const Navbar = () => {
  const anchor = 'left';
  const [open, setOpen] = useState(false);
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setOpen(open);
    };
  return (
    <nav>
      <React.Fragment key={anchor}>
        <StyledButton size="large" onClick={toggleDrawer(true)}>
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="black"
            viewBox="0 0 24 24"
          >
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path
              fill="black"
              d="M3 18h18v-2H3v2zM3 6v2h18V6H3zm0 7h18v-2H3v2z"
            ></path>
          </svg> */}
          button
        </StyledButton>
        <SwipeableDrawer
          open={open}
          anchor={anchor}
          onOpen={toggleDrawer(true)}
          onClose={toggleDrawer(false)}
        >
          <List>
            <ListItem>
              <Link to="/">Home</Link>
            </ListItem>
            <ListItem>
              <Link to="/breeze-of-freedom">Breeze of Freedom</Link>
            </ListItem>
            <ListItem>
              <Link to="/playground">playground</Link>
            </ListItem>
            <ListItem>
              <Link to="/distorted-spirit">distorted spirit</Link>
            </ListItem>
            <ListItem>
              <Link to="/to-believe">to believe</Link>
            </ListItem>
          </List>
        </SwipeableDrawer>
      </React.Fragment>
    </nav>
  );
};

export default App;
