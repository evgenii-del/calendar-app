import axios from 'axios';
import Server from '../src/js/script';

jest.mock('axios');
const serverInstance = new Server('http://158.101.166.74:8080/api/data/', 'evgenii_khasanov', 'events');

describe('test Server class', () => {
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

    test('test get fetchEvents', async () => {
        const data = {
            data: dataArr,
        };

        axios.get.mockImplementationOnce(() => Promise.resolve(data));
        const {data: responseData} = await serverInstance.fetchEvents();

        expect(responseData).toEqual(dataArr);
        expect(responseData.length).toEqual(2);
        expect(axios.get).toHaveBeenCalledTimes(1);
    });

    test('test post createEvent', async () => {
        const data = {
            data: "{\"date\":\"11-Monday\",\"reserved\":true,\"participants\":[\"3\"],\"title\":\"Task 1\",\"color\":\"green\"}",
            id: "63728e10-ece2-42ac-a656-7cb10fbb6ccd"
        }
        axios.post.mockImplementationOnce(() => Promise.resolve(data));
        const {id} = await serverInstance.createEvent(data);
        expect(id).toEqual(data.id);
    });

    test('test delete removeEvent', async () => {
        const id = "11-Monday";
        const data = {
            status: 204
        }
        axios.delete.mockImplementationOnce(() => Promise.resolve(data));
        const {status} = await serverInstance.removeEvent(id);
        expect(status).toEqual(data.status);
    });

    test('test delete removeEvent', async () => {
        const id = "11-Monday";
        const data = {
            status: 204
        }
        axios.delete.mockImplementationOnce(() => Promise.resolve(data));
        const {status} = await serverInstance.removeEvent(id);
        expect(status).toEqual(data.status);
    });
});
