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
  Footer,
  Stat,
  Panel,
  PanelHeader
} from 'rebass';
import parseCSV from './parse_csv';

function requestImage(type, lon, lat) {
  return fetch(`http://localhost:9999/${type}/${lon}/${lat}`)
    .then(res => res.json());
}

var csv =
  'lat,lon,object\n' +
  '8.2786,-2.23602,Dam\n' +
  '6.2996,0.0589,Dam\n' +
  '6.12,0.125,Dam\n' +
  '9.40078,-0.8393,Stadium\n' +
  '9.4103,-0.86124,Stadium\n' +
  '6.676272295,-1.603064254,Stadium\n';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      averageDistance: 0
    };
    this.request = this.request.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }
  request(type, lon, lat) {
    requestImage(type, lon, lat)
      .then(data => {
        var { results } = this.state;
        results.push(data);
        var averageDistance = results.reduce((p, c) => {
          return p + c.distance;
        }, 0) / results.length;
        this.setState({ results, averageDistance });
      })
      .catch(e => console.log(e));
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
    parseCSV(csv)
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
        <DropZone
          onDrop={this.onDrop}
          style={{
            width: '100%',
            height: '40px',
            borderWidth: 2,
            borderColor: '#666',
            borderStyle: 'dashed',
            borderRadius: 5,
            textAlign: 'center'
          }}
          activeStyle={{
            borderStyle: 'solid',
            backgroundColor: '#eee'
          }}>
          <div>drop csv here</div>
        </DropZone>
      </div>
      <Form onSubmit={this.request}/>
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {this.state.results.map((result, i) => <Result
          key={i}
          img={result.img}
          type={result.type}
          distance={result.distance}
          coordsEntered={result.coordsEntered}
          coordsFound={result.coordsFound}/>)}
      </div>
      {this.state.results.length !== 0 && <div className='mb4'>
        <Button>Export Results!</Button>
      </div>}
      <StatsPanel averageDistance={this.state.averageDistance}/>
      <Footer>this has been an abrokwa™ joint</Footer>
    </div>;
  }
}

class Result extends React.Component {
  render() {
    var { img, type, distance, coordsEntered, coordsFound } = this.props;
    return <div style={{width: '30%', marginRight: '10px'}}>
      <Card rounded={true}>
        <CardImage src={img}/>
        <Heading level={4}>Type: {type}</Heading>
        <Heading level={4}>Coordinates Entered: {`${coordsEntered[0]}, ${coordsEntered[1]}`}</Heading>
        <Heading level={4}>Actual Coordinates: {`${coordsFound[0]}, ${coordsFound[1]}`}</Heading>
        <Heading level={4}>Distance: {distance.toFixed(2)}</Heading>
      </Card>
    </div>;
  }
}

class Form extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }
  onChange(field, e) {
    this.setState({[field]: e.target.value});
  }
  submit() {
    var { lon, lat, type } = this.state;
    this.props.onSubmit(type, lon, lat);
  }
  render() {
    return <div className='mb4'>
      <div style={{display: 'table'}}>
        <div style={{display: 'table-row'}}>
          <div style={{width: '20%', display: 'table-cell'}}>
            <Input name='type' label='type' onChange={this.onChange.bind(this, 'type')}/>
          </div>
          <div style={{width: '20%', display: 'table-cell'}}>
            <Input name='longitude' label='longitude' onChange={this.onChange.bind(this, 'lon')}/>
          </div>
          <div style={{width: '20%', display: 'table-cell'}}>
            <Input name='latitude' label='latitude' onChange={this.onChange.bind(this, 'lat')}/>
          </div>
        </div>
      </div>
      <Button onClick={this.submit.bind(this)}>
        Get Image!
      </Button>
    </div>;
  }
}

class StatsPanel extends React.Component {
  render() {
    return <div>
      <Panel theme='info'>
        <PanelHeader inverted={true} theme='default'>Stats</PanelHeader>
        <Stat label='Average Distance' unit='Miles' value={this.props.averageDistance.toFixed(2)}/>
      </Panel>
    </div>;
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
