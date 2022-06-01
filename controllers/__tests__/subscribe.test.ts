import "../../config";
import { subscribe } from "../";
import { getAuth, formatDate } from "../../utils";
import { register } from "../../models";

const FAKE_TIME = "2020-01-01";
const FAKE_AUTH = "fake-auth";
const FAKE_PHONE = "+999999";

jest.mock("../../utils");
jest.mock("../../models");

(getAuth as jest.Mock).mockReturnValue(FAKE_AUTH);
(formatDate as jest.Mock).mockReturnValue(FAKE_TIME);
const mockRegister = (register as jest.Mock).mockResolvedValue({});

const mockNext = jest.fn();
const mockSend = jest.fn();
const response = { sendStatus: mockSend } as any;

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
      auth: FAKE_AUTH,
      phoneNumber: FAKE_PHONE,
      lastUpdateAt: FAKE_TIME,
    });
    expect(response.sendStatus).toHaveBeenCalledWith(200);
  });

  test("returns 400 on failed request", () => {
    const request = {
      body: { phoneNumber: "999999" },
    } as any;

    subscribe(request, response, mockNext);

    expect(mockRegister).not.toHaveBeenCalled();
    expect(response.sendStatus).toHaveBeenCalledWith(400);
  });
});
