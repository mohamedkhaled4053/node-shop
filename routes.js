const fs = require('fs');

const routes = (req, res) => {
  let url = req.url;
  let method = req.method;

  if (url === '/') {
    res.write('<html lang="en">');
    res.write('<head><title>love</title></head>');
    res.write(
      '<body><form action="/message" method="post"><input type="text" name="msg"> <button type="submit">send</button></form></body>'
    );
    res.write('</html>');
    return res.end();
  }

  if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', (chunck) => {
      body.push(chunck);
    });
    return req.on('end', () => {
      let parsedBody = Buffer.concat(body).toString();
      let message = parsedBody.split('=')[1];
      fs.writeFile('message.txt', message, (err) => {
        res.writeHead(302, { location: '/' });
        res.end();
      });
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html lang="en">');
  res.write('<head><title>love</title></head>');
  res.write('<body><h1>i love you</h1></body>');
  res.write('</html>');
  res.end();
};

module.exports = {handler: routes, love: 'love you'}