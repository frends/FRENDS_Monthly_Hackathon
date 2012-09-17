
/*
 * GET home page.
 */

var offer = null
  , answer = null
  , callerCandidate = new Array()
  , calleeCandidate = new Array()
  , Event = require('events').EventEmitter;

var notifier = new Event();

exports.receiveOffer = function(req, res){
  console.log('Step 1 - receiveOffer');
  console.log(req.body.sdp);
  offer = req.body.sdp;
  res.send({'success':true});
  res.end();
};

exports.sendOffer = function(req, res){
  console.log('Step 2 - sendOffer');
  res.send({'sdp': offer});
  res.end();
};

exports.receiveAnswer = function(req, res){
  console.log('Step 3 - receiveAnswer');
  console.log(req.body.sdp);
  answer = req.body.sdp;
  notifier.emit('answer');
  res.send({'success':true});
  res.end();
};

exports.sendAnswer = function(req, res){
  console.log('wating answer');
  notifier.on('answer', function() {
    console.log('Step 4 - sendAnswer');
    res.send({'sdp': answer});
    res.end();
  });
};

exports.receiveAnswer = function(req, res){
  console.log('Step 3 - receiveAnswer');
  console.log(req.body.sdp);
  answer = req.body.sdp;
  notifier.emit('answer');
  res.send({'success':true});
  res.end();
};

exports.sendAnswer = function(req, res){
  console.log('wating answer');
  notifier.on('answer', function() {
    console.log('Step 4 - sendAnswer');
    res.send({'sdp': answer});
    res.end();
  });
};

exports.receiveCallerCandidate = function(req, res){
  console.log('Step 5 - receiveCallerCandidate');
  console.log(req.body);
  callerCandidate.push(req.body);
  notifier.emit('callerCandidate');
  res.send({'success':true});
  res.end();
};

exports.sendCallerCandidate = function(req, res){
  console.log('wating CallerCandidate');
  var candidate = callerCandidate.pop();
  if (candidate) {
    console.log('Step 6 - sendCallerCandidate');
    res.send(candidate);
    res.end();
  } else {
    notifier.once('callerCandidate', function() {
      console.log('Step 6 - sendCallerCandidate');
      res.send(candidate);
      res.end();
    });
  }
};

exports.receiveCalleeCandidate = function(req, res){
  console.log('Step 7 - receiveCalleeCandidate');
  console.log(req.body);
  calleeCandidate.push(req.body);
  notifier.emit('calleeCandidate');
  res.send({'success':true});
  res.end();
};

exports.sendCalleeCandidate = function(req, res){
  console.log('wating CalleeCandidate');
  var candidate = calleeCandidate.pop();
  if (candidate) {
    console.log('Step 8 - sendCalleeCandidate');
    res.send(candidate);
    res.end();
  } else {
    notifier.on('calleeCandidate', function() {
      console.log('Step 8 - sendCalleeCandidate');
      res.send(candidate);
      res.end();
    });
  }
};