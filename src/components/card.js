import React from 'react';

class MyCard extends React.Component {
  render() {
    const img = 'cpng/' + this.props.img + '.jpg';
    const name = this.props.name;

    const status = this.props.status;
    var color = 'btn-primary';
    var text = 'Predict';
    if (status) {
      color = 'btn-outline-danger';
      text = 'Unpredict';
    }

    return (
      <div className="col-sm-4 col-md-3 col-lg-2" style={{ height: '80%' }}>
        <div className="card gallery-item">
          <img className="card-img-top" src={img} alt={name} />
          <div className="card-body">
            <h5 className="card-title">{name}</h5>
            <p>{this.props.type}</p>
            <button onClick={this.props.handler} className={`btn ${color}`}>
              {' '}
              {text}{' '}
            </button>

            {/* add on click to this button  */}
          </div>
        </div>
      </div>
    );
  }
}

export default MyCard;
