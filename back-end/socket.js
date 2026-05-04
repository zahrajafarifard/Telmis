let io;
module.exports = {
  init: (server) => {
    // start socket.io server and cache io value
    io = require("socket.io")(server, {
      cors: {
        origin: "*",
        methods: ["*"],
        allowedHeaders: ["*"],
      },

      // transports: ["websocket", "polling"],
      transports: ["websocket"],
      allowEIO3: true,
      // wsEngine: "ws",
    });

    return io;
  },
  getio: () => {
    // return previously cached value
    if (!io) {
      throw new Error("must call .init(server) before you can call .getio()");
    }

    return io;
  },
};
