import { useParams } from 'react-router';
import { P5Frame } from '../../foundation/P5Frame';
import { Link } from 'react-router-dom';
import { List, ListItem } from '@mui/material';

const sketches = require('./sketches');

export function GenerativeArtLearning() {
  const keys = Object.keys(sketches);
  const { sketchId } = useParams();
  if (sketchId) {
    return <P5Frame sketch={sketches[sketchId]} autofit={false} />;
  }
  return (
    <div>
      <List>
        {keys.map((key: string) => {
          return (
            <ListItem>
              <Link to={`${key}`} key={key}>
                {key}
              </Link>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
