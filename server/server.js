const express = require('express');
const fsPromises = require("fs/promises");
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

let onlineCount = 0;

let users = [];


const base64_decode = async (base64Image, file) => {
  var output = String(base64Image).split("base64,")[1];
  await fsPromises.writeFile(file, output,'base64', function(err){
  //Finished
  });
  //console.log(output);
};


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

app.get("/service-worker.js", (req, res) => {
	res.sendFile(path.resolve(__dirname, "public", "service-worker.js"));
  });

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
  let addedToList = false;
	let color;
	let room;
	let currentUsersInRoom;

	socket.on("join", (join) => {
		if (addedToList) return;
		onlineCount++;
		join.id = onlineCount;
		addedToList = true;
		color = "red";
		room = join.room;
		join.color = color;
		users.push(join);
		socket.join(join.room);
		socket.userId = join.id;
		socket.emit("joined", join);
		currentUsersInRoom = users.filter((user) => {
			if (user.room === room) {
				return user;
			}
		});

		io.in(room).emit("users", currentUsersInRoom);
	});

	socket.on("drawing", (data) => {
		socket.in(data.room).emit("drawing", data);
	});

	socket.on("color-change", (data) => {
		currentUsersInRoom = users.filter((user) => {
			if (user.room === data.room) {
				if (user.id === data.id) {
					color = data.color;
					user.color = data.color;
				}
				return user;
			}
		});
		io.in(data.room).emit("users", currentUsersInRoom);
	});

	socket.on("leaveroom", (data) => {
		addedToList = false;
		users = users.filter((user) => {
			if (user.id !== socket.userId) {
				return user;
			}
		});
		let currentUsersInThisRoom = users.filter((user) => {
			if (user.room === data.room) {
				if (user.id !== socket.userId) {
					return user;
				}
			}
		});
		currentUsersInRoom = [];
		io.in(data.room).emit("users", currentUsersInThisRoom);
	});

	socket.on("clear", (clear) => {
		io.in(clear).emit("cleared", clear);
	});

	socket.on("disconnect", () => {
		addedToList = false;

		users = users.filter((user) => {
			if (user.id !== socket.userId) {
				return user;
			}
		});

		currentUsersInRoom = users.filter((user) => {
			if (user.room === room) {
				return user;
			}
		});

		io.in(room).emit("users", currentUsersInRoom);
	});

  socket.on('image', (image) =>{
    data = JSON.stringify(image.image);
    //console.log(data);
	function saved(){
		var isaved = "jobs done!"
		io.in(image.room).emit("saved",isaved)};
	base64_decode(data,`../client/src/assets/${image.room}.png`)
	setTimeout(saved,2000);

});

})
});
