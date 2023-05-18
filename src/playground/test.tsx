import { P5Frame } from '../foundation/P5Frame';
import caos from './sketches/fire'

const MainPage = () => {
  return (
    <div>
      <P5Frame sketch={caos} />
    </div>
  );
};

export default MainPage;
