import './App.css';
import BreezeOfFreedom from './breeze-of-freedom/main';
import { Route, Link, Routes, Outlet, BrowserRouter } from 'react-router-dom';
import { P5Frame } from './foundation/P5Frame';
import Test from './playground/test';
import DistortedSpirit from './projects/DistortedSpirit/DistortedSpirit';
import ToBelieve from './projects/ToBelieve/ToBelieve';

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/breeze-of-freedom">Breeze of Freedom</Link>
            </li>
            <li>
              <Link to="/playground">playground</Link>
            </li>
            <li>
              <Link to="/distorted-spirit">distorted spirit</Link>
            </li>
            <li>
              <Link to="/to-believe">to believe</Link>
            </li>
          </ul>
        </nav>
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

export default App;
