import "../../config";
import { subscribe } from "../";
import { stripTime } from "../../utils";
import { register } from "../../models";

const FAKE_TIME = new Date("2020-01-01 00:00:00");
const FAKE_ID = "fake-id";
const FAKE_PHONE = "+999999";

jest.mock("../../utils");
jest.mock("../../models");

(stripTime as jest.Mock).mockReturnValue(FAKE_TIME);

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

describe("'subscribe' responds correctly", () => {
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
      lastUpdateAt: FAKE_TIME,
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
