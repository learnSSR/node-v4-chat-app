class Users {
  constructor () {
    this.users = [];
  }

  addUser (id, name, room) {
    var user = {
      id,
      name,
      room
    };
    this.users.push(user);
    return user;
  }

  removeUser (id) {
    var user = this.getUser(id);
    if (user) {
      this.users = this.users.filter((user) => user.id != id);
    }
    return user;
  };

  getUser (id) {
    return this.users.filter((user) => user.id === id)[0];
  }

  getUserList (room) {
    var users = this.users.filter((user) => user.room === room);
    var userNames = users.map((user) => user.name);
    return userNames;
  }

  getRoomList () {
    return this.users.map((user) => user.room);
  }

  getUniqueRoomList () {
    return [... new Set (this.getRoomList())];
  }

  isUniqueUserName (name, room) {
    var user = this.users.filter((user) => user.name === name && user.room === room)[0];
    if (user){
      return false;
    }
    return true;
  };
}

module.exports = {
  Users,
}
