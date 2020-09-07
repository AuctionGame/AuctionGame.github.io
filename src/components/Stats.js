import React from 'react'
import playerdata from '../data/playerData.json'

export default function Stats(props) {
  //Props receive playerno props.playerNo
  var pdata = playerdata[props.playerNo]
  const heading = []
  const data = {}
  try {

    for (const [year, value] of Object.entries(pdata)) {
      // use key and value
      heading.push(<td style={{ fontWeight: "bold" }}>{year}</td>)
      for(const [field,value1] of Object.entries(pdata[year])) {
        if (data[field]){
          data[field].push(pdata[year][field])
        }
        else{
          data[field] = [pdata[year][field]]
        }
  
      }
    }
    
  } catch (error) {

    console.log("stats.js mein sed lyf 3")
    
  }
  
  const Body = []
  for(var field in data) {
    const tempList = []
    tempList.push(<td style={{ fontWeight: "bold" }}>{field}</td>)
    for(var ob in data[field]) {
      tempList.push(<td >{data[field][ob]}</td>)
    }
    Body.push(<tr>{tempList}</tr>)
  }
  
  console.log('playerdata: ', data)
  
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
          {Body}
        </tbody>
      </table>
    </div>
  )
}