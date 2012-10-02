
/*
 * GET home page.
 */

var offer = null
  , answer = null
  , callerCandidate = new Array()
  , calleeCandidate = new Array()
  , Event = require('events').EventEmitter;

var notifier = new Event();

exports.sendOfferToCallee = function(req, res){
  console.log('Step 1 - sendOfferToCallee');
  console.log(req.body.sdp);
  offer = req.body.sdp;
  res.send({'success':true});
  res.end();
};

exports.getOfferFromCaller = function(req, res){
  console.log('Step 2 - getOfferFromCaller');
  res.send({'sdp': offer});
  res.end();
};

exports.sendAnswerToCaller = function(req, res){
  console.log('Step 3 - sendAnswerToCaller');
  console.log(req.body.sdp);
  answer = req.body.sdp;
  notifier.emit('answer');
  res.send({'success':true});
  res.end();
};

exports.getAnswerToCallee = function(req, res){
  console.log('wating answer');
  notifier.on('answer', function() {
    console.log('Step 4 - getAnswerToCallee');
    res.send({'sdp': answer});
    res.end();
  });
};

exports.sendCandidateToCallee = function(req, res){
  console.log('Step 5 - sendCandidateToCallee');
  console.log(req.body);
  callerCandidate.push(req.body);
  notifier.emit('callerCandidate');
  res.send({'success':true});
  res.end();
};

exports.getCandidateFromCaller = function(req, res){
  console.log('wating CallerCandidate');
  var candidate = callerCandidate.pop();
  if (candidate) {
    console.log('Step 6 - getCandidateFromCaller');
    res.send(candidate);
    res.end();
  } else {
    notifier.once('callerCandidate', function() {
      console.log('Step 6 - getCandidateFromCaller');
      res.send(candidate);
      res.end();
    });
  }
};

exports.sendCandidateToCaller = function(req, res){
  console.log('Step 7 - sendCandidateToCaller');
  console.log(req.body);
  calleeCandidate.push(req.body);
  notifier.emit('calleeCandidate');
  res.send({'success':true});
  res.end();
};

exports.getCandidateFromCallee = function(req, res){
  console.log('wating CalleeCandidate');
  var candidate = calleeCandidate.pop();
  if (candidate) {
    console.log('Step 8 - getCandidateFromCallee');
    res.send(candidate);
    res.end();
  } else {
    notifier.on('calleeCandidate', function() {
      console.log('Step 8 - getCandidateFromCallee');
      res.send(candidate);
      res.end();
    });
  }
};