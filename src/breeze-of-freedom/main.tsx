import { P5Frame } from '../foundation/P5Frame';
import { breezeOfFreedomSketch } from './sketch';

const MainPage = () => {
  return (
    <div>
      <P5Frame sketch={breezeOfFreedomSketch} />
    </div>
  );
};

export default MainPage;
