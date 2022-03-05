const express = require('express');
const fs = require('fs');
// import ApolloServer and socket
const { ApolloServer } = require('apollo-server-express');
const socketio = require('socket.io');

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const { authMiddleware } = require('./utils/auth');

const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();


function base64_decode(base64Image, file) {
  var output = String(base64Image).split("base64,")[1];
  fs.writeFileSync(file, output,'base64', function(err){
  //Finished
  });
   console.log(output);

}


const startServer = async () => {
  // create a new Apollo server and pass in our schema data
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
  });

  // Start the Apollo server
  await server.start();

  // integrate our Apollo server with the Express application as middleware
  server.applyMiddleware({ app });

  // log where we can go to test our GQL API
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

// Initialize the Apollo server
startServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


db.once('open', () => {
  const http = app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
  // Attach socket.io to the server instance
const io = socketio(http)
io.on('connection', (socket) => {
  socket.on('drawing', function(data){
    socket.broadcast.emit('drawing', data);
    console.log(data);
  });

  socket.on('image', function(image) {
    data = JSON.stringify(image.image);
    //console.log(data);
    base64_decode(data,'copy.png')

});

})
});
