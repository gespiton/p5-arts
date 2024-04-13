import { P5Frame } from '../../foundation/P5Frame';
import {
  spiralRandom
} from './sketches';

export function GenerativeArtLearning() {
  return <div>
    <P5Frame sketch={spiralRandom} autofit={false}/>
  </div>
}