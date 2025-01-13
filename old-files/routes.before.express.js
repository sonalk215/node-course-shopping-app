const fs = require('fs');


const requestHandler = (req, res) => {
  // console.log(req.url, req.method, req.headers);
  const url = req.url;
  const method = req.method;

  if (url==='/') {
    res.write('<html>');
    res.write('<head><title>Enter message</title></head>');
    res.write('<body><form action="/message" method="POST"><input name="message" type="text"><button type="submit">Send</button></form></body>');
    res.write('</html>');
    return res.end();
  }
  if (url==='/message' && method==='POST') {
    const body = [];

    req.on('data', (chunk) => {
      body.push(chunk); 
    });
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      fs.writeFile('message.txt', message, (err) => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    })
  }
  
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page</title></head>');
  res.write('<body><h1>Hello from Node.js server</h1></body>');
  res.write('</html>');
  res.end();
  // process.exit();
}

// module.exports = requestHandler;  //1 way

// module.exports = {  //another way
//   handler: requestHandler,
//   someText: 'hardCoded text'
// }

module.exports.handler = requestHandler;  //shortcut   exports.handler = requestHandler;
module.exports.someText = 'hardCoded text';  //shorcut  exports.someText = 'hardCoded text';