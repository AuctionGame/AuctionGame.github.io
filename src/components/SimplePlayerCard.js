import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import players from '../data/players.json';
import adjective from '../data/adjective.json'

const useStyles = makeStyles({
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function SimplePlayerCard(props) {
  const classes = useStyles();

  const imgSrc = 'cpng/' + props.value + '.jpg';

  var priceSection = 'Unsold';
  if (props.price) {
    priceSection = <p>Rs. {props.price}</p>
  }

  return (
    <div className="col">
      <Card className="simple-player-card">
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            <img className="gallery-item" src={imgSrc} alt="Player"></img>
          </Typography>
          <Typography variant="h5" component="h2">
            {players[props.value]}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            {adjective[props.value]}
          </Typography>
          {priceSection}
        </CardContent>
      </Card>
    </div>
  );
}
