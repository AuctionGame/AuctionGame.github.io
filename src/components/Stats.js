import React from 'react'
import playerdata from '../data/playerData.json'

export default function Stats(props) {
  //Props receive playerno props.playerNo
  var pdata = playerdata[props.playerNo]
  const heading = []
  for(var key in pdata){
    heading.push(<td style={{ fontWeight: "bold" }}>{key}</td>)
  }

  return (
    <div id="player-stats" className="jumbotron" style={{ margin: "22px", padding: "10px" }}>
      <table className="table">
        <thead>
          <tr>
            <td></td>
            
            {heading}
            
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ fontWeight: "bold" }}>Matches</td>
            <td>15</td>
            <td>16</td>
            <td>16</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold" }}>Runs</td>
            <td>416</td>
            <td>455</td>
            <td>290</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold" }}>Average</td>
            <td>83.20</td>
            <td>75.83</td>
            <td>26.63</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold" }}>Strike Rate</td>
            <td>135.38</td>
            <td>150.66</td>
            <td>116.00</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold" }}>Catches</td>
            <td>11</td>
            <td>11</td>
            <td>10</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold" }}>Stumpins</td>
            <td>5</td>
            <td>3</td>
            <td>3</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}