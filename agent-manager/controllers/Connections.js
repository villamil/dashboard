const Connections = require("../collections/Connections");
const { CONNECTION_STATUS } = require("../constants");

const resetConnections = async () => {
  await Connections.updateMany(
    { status: CONNECTION_STATUS.CONNECTED },
    { status: CONNECTION_STATUS.DISCONNECTED }
  );
};

module.exports = { resetConnections };
