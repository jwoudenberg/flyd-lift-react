var React = require('react');
var flyd = require('flyd');
var latest = require('flyd/module/switchlatest');

module.exports = function Lift (Component) {
  return React.createClass({
    getInitialState: function () {
      var propsStream = mergePropertyStreams(this.props);
      this.propsStreams = flyd.stream(propsStream);
      return propsStream();
    },
    componentWillReceiveProps: function (nextProps) {
      var newPropsStream = mergePropertyStreams(nextProps);
      this.propsStreams(newPropsStream);
    },
    componentDidMount: function () {
      var latestPropsStream = this.latestPropsStream = latest(this.propsStreams);
      flyd.on(function updateState (newProps) {
        this.setState(newProps);
      }.bind(this), latestPropsStream);
    },
    componentWillUnmount: function () {
      this.latestPropsStream.end(true);
    },
    render: function render () {
      var props = this.state;
      return React.createElement(
        Component,
        props
      );
    }
  });
};

//Takes an object of streams and returns a stream of objects.
function mergePropertyStreams (obj) {
  var keys = Object.keys(obj);
  var streamsObj = keys.reduce(function addStream (streamsObj, key) {
    var value = obj[key];
    if (flyd.isStream(value)) {
      streamsObj[key] = value;
    }
    return streamsObj;
  }, {});
  var streams = Object.keys(streamsObj).map(function getStream (key) {
    return obj[key];
  });
  var streamOfObjects = flyd.stream(streams, function buildObject () {
    var newObject = keys.reduce(function addValue (newObject, key) {
      var stream = streamsObj[key];
      newObject[key] = stream ? stream() : obj[key];
      return newObject;
    }, {});
    return newObject;
  });
  return flyd.immediate(streamOfObjects);
}
