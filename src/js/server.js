import axios from 'axios';

class Server {
  constructor(url, system, entity) {
    if (typeof Server.instance === 'object') {
      return Server.instance;
    }
    this.fullUrl = `${url}${system}/${entity}`;
    Server.instance = this;
    return this;
  }

  async fetchEvents() {
    return axios.get(this.fullUrl);
  }

  async createEvent(body) {
    return axios.post(this.fullUrl, body);
  }

  async removeEvent(id) {
    return axios.delete(`${this.fullUrl}/${id}`);
  }
}

export default Server;
