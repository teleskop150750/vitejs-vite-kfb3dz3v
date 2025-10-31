class DB {
  private data: { firstName: string; lastName: string };

  constructor() {
    this.data = { firstName: 'FirstName', lastName: 'LastName' };
  }

  getData(): { firstName: string; lastName: string } {
    return { ...this.data };
  }

  async saveUser(value: { firstName: string; lastName: string }) {
    this.data = value;
    return value;
  }
}

export const db = new DB();
