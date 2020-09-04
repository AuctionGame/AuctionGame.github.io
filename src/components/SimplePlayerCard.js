import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import players from '../data/players.json';
import adjective from '../data/adjective.json';
import bidprice from '../data/bidprice.json';

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

  /**
   * value
   * highQuality
   * colSize
   * price
   * sold
   * toShowBidPrice
   */

  let imgSrc = 'cpng/' + props.value + '.jpg';
  if(props.highQuality) {
    imgSrc = 'images/png/' + props.value + '.png';
  }

  let colToUse = 4; // Numric value
  if (props.colSize) {
    colToUse = props.colSize;
  }

  let fullHeight = 'simple-player-card height-in-percent';
  if (props.fixedHeight) {
    fullHeight = 'simple-player-card';
  }

  var priceSection = '';
  var bought = 'col-sm-'+ colToUse +' not-sold-player';
  if (props.price) {
    priceSection = <p>Sold Rs. {props.price}</p>;
    if (props.sold) {
      bought = 'col-sm-'+ colToUse +' sold-player';
    }
  }

  let bidPrice = '';
  if (props.toShowBidPrice) {
  bidPrice = <p>Starting Bid Rs. {bidprice[props.value]}</p>
  }

  

  return (
    <div className={bought}>
      <Card className={fullHeight}>
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
          {bidPrice}
          {priceSection}
        </CardContent>
      </Card>
    </div>
  );
}
