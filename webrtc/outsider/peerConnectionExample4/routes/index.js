
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: '2-way PeerConnection Demo using WebSocket' });
};