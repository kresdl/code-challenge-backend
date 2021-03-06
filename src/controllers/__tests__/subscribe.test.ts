import { subscribe } from "../";
import { register } from "../../models";

const FAKE_YESTERDAY = "2020-10-09 11:11:11";
const FAKE_ID = "fake-id";
const FAKE_PHONE = "+999999";

jest.mock("../../models");
jest.useFakeTimers();
jest.setSystemTime(new Date("2020-10-10 11:11:11"));

const mockRegister = (register as jest.Mock).mockResolvedValue({});
const mockNext = jest.fn();
const mockSendStatus = jest.fn();
const mockSend = jest.fn();
const mockStatus = jest.fn().mockReturnThis();

const response = {
  locals: { userId: FAKE_ID },
  send: mockSend,
  status: mockStatus,
  sendStatus: mockSendStatus,
} as any;

describe("can subscribe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("updates user and returns 200 on successful request", async () => {
    const request = {
      body: { phoneNumber: FAKE_PHONE },
    } as any;

    await subscribe(request, response, mockNext);

    expect(mockRegister).toHaveBeenCalledWith({
      id: FAKE_ID,
      phoneNumber: FAKE_PHONE,
      updatesFrom: FAKE_YESTERDAY,
    });
    expect(mockSendStatus).toHaveBeenCalledWith(200);
  });

  test("returns 400 on failed request", async () => {
    const request = {
      body: { phoneNumber: "999999" },
    } as any;

    await subscribe(request, response, mockNext);

    expect(mockRegister).not.toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockSend).toHaveBeenCalled();
  });
});
