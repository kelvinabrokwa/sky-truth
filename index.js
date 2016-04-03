import React from 'react';
import ReactDOM from 'react-dom';
import {
  Input,
  Button,
  Card,
  CardImage,
  PageHeader,
  Heading,
  Footer
} from 'rebass';

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
  }
  request(type, lon, lat) {
    requestImage(type, lon, lat)
      .then(img => console.log(img));
  }
  render() {
    return <div className='container'>
      <PageHeader heading='Sky Truth' description='Get Satellite Imagery! Fill the form or drag and drop a CSV file onto the page. Whatever floats your boat, man ;)'/>
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
    return <div style={{width: '50%'}}>
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
          <div style={{width: '33%', display: 'table-cell'}}>
            <Input name='type' label='type'/>
          </div>
          <div style={{width: '33%', display: 'table-cell'}}>
            <Input name='longitude' label='longitude'/>
          </div>
          <div style={{width: '33%', display: 'table-cell'}}>
            <Input name='latitude' label='latitude'/>
          </div>
        </div>
      </div>
      <Button onClick={this.props.request}>Get Image!</Button>
    </div>;
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
