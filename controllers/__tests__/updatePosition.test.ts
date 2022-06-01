import "../../config";
import { updatePosition } from "../";
import { getAuth } from "../../utils";
import { updatePosition as update } from "../../models";

const FAKE_AUTH = "fake-auth";
const FAKE_LATITUDE = 14.4343;
const FAKE_LONGITUDE = 44.2543;

jest.mock("../../utils");
jest.mock("../../models");

(getAuth as jest.Mock).mockReturnValue(FAKE_AUTH);

const mockUpdatePosition = (update as jest.Mock).mockResolvedValue({});
const mockNext = jest.fn();
const mockSendStatus = jest.fn();
const mockSend = jest.fn();
const mockStatus = jest.fn().mockReturnThis();

const response = {
  send: mockSend,
  status: mockStatus,
  sendStatus: mockSendStatus,
} as any;

describe("'updatePosition' responds correctly", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("updates user and returns 200 on successful request", async () => {
    const request = {
      body: {
        latitude: FAKE_LATITUDE,
        longitude: FAKE_LONGITUDE,
      },
    } as any;

    await updatePosition(request, response, mockNext);

    expect(mockUpdatePosition).toHaveBeenCalledWith(FAKE_AUTH, {
      latitude: FAKE_LATITUDE,
      longitude: FAKE_LONGITUDE,
    });
    expect(mockSendStatus).toHaveBeenCalledWith(200);
  });

  test("returns 400 on failed request", async () => {
    const request = {
      body: {
        latitude: "",
        longitude: FAKE_LONGITUDE,
      },
    } as any;

    await updatePosition(request, response, mockNext);

    expect(mockUpdatePosition).not.toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockSend).toHaveBeenCalled();
  });
});
