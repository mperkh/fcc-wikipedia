import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import './index.css';
import reqwest from 'reqwest';
import { Grid } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { FormGroup } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { ButtonToolbar } from 'react-bootstrap';

class Article extends Component {
  render() {
    return (
      <a href={this.props.url} target="_blank" className="list-group-item">
        <h3>{this.props.title}</h3>
        <p>
          {this.props.children}
        </p>
      </a>
    );
  }
}

class SearchResults extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      result: undefined,
      searchString: ''
    }
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  };

  callWikipediaAPI(searchString) {
    reqwest({
      url: 'https://en.wikipedia.org/w/api.php',
      type: 'jsonp',
      data: {
        'action': 'opensearch',
        'format': 'json',
        'search': searchString
      },
      success: (result) => {
        this.setState({
          searchString: searchString,
          result: result
        });
      }
    });
  };

  handleSearchSubmit(searchString) {
    this.callWikipediaAPI(searchString);
  }

  render() {

    if (this.state.result !== undefined && this.state.result[1].length > 0) {
      return (
        <div>
          <SearchBox onSearchSubmit={this.handleSearchSubmit} value={this.state.searchString}/>
          <div className="panel panel-success">
            <div className="panel-heading">
              Search Results
            </div>
            <div className="list-group">
              {
                this.state.result[1].map((entry, idx) => {
                  return (
                    <Article title={entry} url={this.state.result[3][idx]} key={idx}>
                      {this.state.result[2][idx]}
                    </Article>
                  )
                })
              }
            </div>
          </div>
        </div>
      );
    } else if (this.state.result !== undefined && this.state.result[1].length === 0) {
      return  (
        <div>
          <SearchBox onSearchSubmit={this.handleSearchSubmit} value={this.state.searchString} />
          <Alert bsStyle="danger">
            <strong>Status:</strong> No results
          </Alert>
        </div>
      );
    } else {
      return (
        <SearchBox onSearchSubmit={this.handleSearchSubmit} value={''} />
      )
    }

  }
}

class SearchBox extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      userInput: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleInputChange(e) {
    this.setState({userInput: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onSearchSubmit(this.state.userInput.trim());
  }

  getValidationState() {
    const length = this.state.userInput.length;
    if (length > 2) return 'success';
    else if (length > 0) return 'error';
  }

  getDisabledState() {
    const length = this.state.userInput.length;
    if (length < 2) return true;
    else return false;
  }

  componentDidMount() {
    let value;
    if (this.props.value !== undefined) {
      value = this.props.value
    } else {
      value = ''
    }
    this.setState({
      userInput: value
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup
          bsSize="large"
          validationState={this.getValidationState()}
        >
          <FormControl
            type="text"
            placeholder="Search Wikipedia"
            value={this.state.userInput}
            onChange={this.handleInputChange}
          />
          <ButtonToolbar>
            <Button type="submit" bsStyle="primary" disabled={this.getDisabledState()}>
              Search Wikipedia
            </Button>
            <Button bsStyle="link" href="https://en.wikipedia.org/wiki/Special:Random" target="_blank">
              Random Wikipedia
            </Button>
          </ButtonToolbar>
        </FormGroup>
      </form>
    );
  }
}

class App extends Component {
  render() {
    return (
      <Grid fluid={true}>
        <Row className="App">
          <Col lg={8} lgOffset={2}>
            <SearchResults />
          </Col>
        </Row>
      </Grid>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
