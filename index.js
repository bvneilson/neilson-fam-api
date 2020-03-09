const server = require('./server.js');
const port = process.env.PORT || 8087;

server.listen(port, () => console.log(`Listening for changes on port ${port}`));
