/* eslint-env jest */
/* eslint-ecmaFeatures jsx */
const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');
const stream = require('flyd').stream;
jest.dontMock('../');
const Lift = require('../');

const TestComponent = (props) => (
  <div>{props.a},{props.b},{props.c}</div>
);

const LiftedTestComponent = Lift(TestComponent);

describe('Lift', function () {

  it('passes on stream values as properties', function () {
    const liftedComponent = TestUtils.renderIntoDocument(React.createElement(
      LiftedTestComponent,
      { a: stream(1), b: stream(2), c: stream(3) }
    ));
    const liftedComponentNode = ReactDOM.findDOMNode(liftedComponent);
    expect(liftedComponentNode.textContent).toEqual('1,2,3');
  });

  it('handles a mix of stream and non stream properties', function () {
    const liftedComponent = TestUtils.renderIntoDocument(React.createElement(
      LiftedTestComponent,
      { a: stream(1), b: null, c: 'foo' }
    ));
    const liftedComponentNode = ReactDOM.findDOMNode(liftedComponent);
    expect(liftedComponentNode.textContent).toEqual('1,,foo');
  });

  it('updates when a new value is pushed into a stream', function () {
    const propStream = stream(1);
    const liftedComponent = TestUtils.renderIntoDocument(React.createElement(
      LiftedTestComponent,
      { a: propStream, b: null, c: 'foo' }
    ));
    const liftedComponentNode = ReactDOM.findDOMNode(liftedComponent);
    expect(liftedComponentNode.textContent).toEqual('1,,foo');
    propStream(2);
    expect(liftedComponentNode.textContent).toEqual('2,,foo');
  });

});
