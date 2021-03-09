import User from './user';


class Admin extends User {
  constructor(id, name) {
    super(id, name);
    this.isAdmin = true;
  }
}

export default Admin;
