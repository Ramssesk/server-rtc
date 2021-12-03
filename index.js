const express = require("express")
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 4000;
app.use(cors({
	origin: '*', 
    methods: ['GET','POST']
}));
app.use(express.json({extended: true}));

app.get("/holo", (req, res) => {
	res.send('server is running');
});

const server = app.listen(PORT, () => console.log('listen: ', PORT))

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

io.on("connection", (socket) => {
	console.log(socket.id)
	socket.emit("me", socket.id);
	
	socket.on("disconnect", () => {
		socket.broadcast.emit("callended")
	});
	
	socket.on("calluser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("calluser", { signal: signalData, from, name });
	});

	socket.on("answercall", (data) => {
		io.to(data.to).emit("callaccepted", data.signal)
	});
});