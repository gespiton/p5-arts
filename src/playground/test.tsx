import { P5Frame } from '../foundation/P5Frame';
import sketch from './sketches/particlePerformanceTest';

const MainPage = () => {
  return (
    <div>
      <P5Frame sketch={sketch} />
    </div>
  );
};

export default MainPage;
