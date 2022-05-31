import "../config";
import { subscribe } from "../";
import users from "../../users";
import { getAuth } from "../../utils";

const fakeDate = new Date("2020-01-01");

const FAKE_AUTH = "fake-auth";
const FAKE_PHONE = "+999999";
const FAKE_DATE = fakeDate.toDateString();

jest.useFakeTimers();
jest.setSystemTime(fakeDate);

jest.mock("./users");
jest.mock("./utils");

const mockSetUser = jest.fn();
const mockGetUser = jest.fn((_auth: string) => ({
  phoneNumber: FAKE_PHONE,
  lastUpdateAt: FAKE_DATE,
}));

users.get = mockGetUser;
users.set = mockSetUser;

(getAuth as jest.Mock).mockReturnValue(FAKE_AUTH);

const mockNext = jest.fn();
const mockSend = jest.fn();
const response = { sendStatus: mockSend } as any;

describe("'subscribe' responds correctly", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("updates user and returns 200 on successful request", () => {
    const request = {
      body: { phoneNumber: FAKE_PHONE },
    } as any;

    subscribe(request, response, mockNext);

    expect(mockSetUser).toHaveBeenCalledWith(FAKE_AUTH, {
      phoneNumber: FAKE_PHONE,
      lastUpdateAt: FAKE_DATE,
    });
    expect(response.sendStatus).toHaveBeenCalledWith(200);
  });

  test("returns 400 on failed request", () => {
    const request = {
      body: { phoneNumber: "999999" },
    } as any;

    subscribe(request, response, mockNext);

    expect(mockSetUser).not.toHaveBeenCalled();
    expect(response.sendStatus).toHaveBeenCalledWith(400);
  });
});
