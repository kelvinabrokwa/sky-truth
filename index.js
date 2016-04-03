import React from 'react';
import ReactDOM from 'react-dom';
import DropZone from 'react-dropzone';
import {
  Input,
  Button,
  Card,
  CardImage,
  PageHeader,
  Heading,
  Footer
} from 'rebass';
import parseCSV from './parse_csv';

function requestImage(type, lon, lat) {
  return fetch(`http://localhost:9999/${type}/${lon}/${lat}`)
    .then(res => res.text())
    .catch(e => console.log(e));
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [
        {
          img: 'https://maps.googleapis.com/maps/api/staticmap?center=5.55298012817435%2C-0.187067272635455&zoom=19&size=500x500&maptype=satellite&key=AIzaSyAvxKwQPytvABv_gxCVNXY1DSqlqBG_-Do',
          distance: 12,
          type: 'stadium',
          coordsEntered: [0, 0],
          coordsFound: [1, 1]
        }
      ]
    };
    this.request = this.request.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }
  request(type, lon, lat) {
    requestImage(type, lon, lat)
      .then(img => console.log(img));
  }
  onDrop(/*file*/) {
    /*
    var reader = new FileReader();
    reader.onload = function() {
      var text = reader.result;
      console.log(text);
    };
    reader.readAsText(file);
    */
    parseCSV('1,2,3\n0,0,building')
      .then(data => {
        var row;
        for (var i = 0; i < data.length; i++) {
          row = data[i];
          var lat = row[0],
              lon = row[1],
              type = row[2];
          this.request(type, lon, lat);
        }
      });
  }
  render() {
    return <div className='container'>
      <PageHeader heading='Sky Truth' description='Fill the form or drag and drop a CSV file onto the page. Whatever floats your boat, man.'/>
      <div className='mb4'>
        <DropZone onDrop={this.onDrop}>
          <div>drop csv here</div>
        </DropZone>
      </div>
      <Form onSubmit={this.request}/>
      {this.state.results.map((result, i) => <Result
        key={i}
        img={result.img}
        type={result.type}
        distance={result.distance}
        coordsEntered={result.coordsEntered}
        coordsFound={result.coordsFound}/>)}
      <Footer>this has been an abrokwa™ joint</Footer>
    </div>;
  }
}

class Result extends React.Component {
  render() {
    var { img, type, distance, coordsEntered, coordsFound } = this.props;
    return <div style={{width: '30%'}}>
      <Card rounded={true}>
        <CardImage src={img}/>
        <Heading level={4}>type: {type}</Heading>
        <Heading level={4}>Coordinates Entered: {`${coordsEntered[0]}, ${coordsEntered[1]}`}</Heading>
        <Heading level={4}>Actual Coordinates: {`${coordsFound[0]}, ${coordsFound[1]}`}</Heading>
        <Heading level={4}>distance: {distance}</Heading>
      </Card>
    </div>;
  }
}

class Form extends React.Component {
  render() {
    return <div className='mb4'>
      <div style={{display: 'table'}}>
        <div style={{display: 'table-row'}}>
          <div style={{width: '20%', display: 'table-cell'}}>
            <Input name='type' label='type'/>
          </div>
          <div style={{width: '20%', display: 'table-cell'}}>
            <Input name='longitude' label='longitude'/>
          </div>
          <div style={{width: '20%', display: 'table-cell'}}>
            <Input name='latitude' label='latitude'/>
          </div>
        </div>
      </div>
      <Button onClick={this.props.request}>Get Image!</Button>
    </div>;
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
