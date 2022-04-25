import ScheduleController from "./ScheduleController.js";
import { connect, clearDatabase, closeDatabase } from "../../tests/db.js";

const scheduleController = new ScheduleController();

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

let req = {};
let res = {
    send: jest.fn((result) => result),
    json: jest.fn((res) => res),
    status: jest.fn((code) => code),
};

describe("Schedule Controller", () => {
    it("Get all schedules", async () => {
        const request = await scheduleController.findAll(req, res);
        expect(request).toEqual([]);
    });

    it("Create a new valid schedule", async () => {
        req = {
            body: {
                scheduledTo: "2022-11-22T08:00:00.000Z",
                name: "Jane Doe",
                bornDate: "2022-04-15T17:14:00.000Z",
                email: "",
            },
        };

        const request = await scheduleController.create(req, res);
        expect(request.message).toContain("Schedule created");
    });
});
