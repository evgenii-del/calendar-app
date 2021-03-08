import axios from 'axios';
import Server from '../src/js/script';

jest.mock('axios');
const serverInstance = new Server('http://158.101.166.74:8080/api/data/', 'evgenii_khasanov', 'events');
describe('test Server class', () => {
  it('fetches successfully data from an API', async () => {
    const dataArr = [
      {
        data: '{"date":"14-Friday","reserved":true,"participants":["1"],"title":"Task 7","color":"green"}',
        id: 'dbfc775b-e102-435e-ba71-49a71641d129',
      },
      {
        data: '{"date":"15-Monday","reserved":true,"participants":["1"],"title":"Task 123","color":"yellow"}',
        id: '61d5b51f-3c5d-47fe-9119-f2c6c44aa5e9',
      },
    ];
    const data = {
      data: dataArr,
    };

    axios.get.mockImplementationOnce(() => Promise.resolve(data));
    const response = await serverInstance.fetchEvents();

    expect(response).toEqual(dataArr);
    expect(response.length).toEqual(2);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});
