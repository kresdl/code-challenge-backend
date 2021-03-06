import { getUserId } from "../../utils";
import auth, { UNAUTHORIZED_MESSAGE } from "../auth";

const FAKE_ID = "fake-id";

jest.mock("../../utils", () => ({
  getUserId: jest.fn(),
}));

const mockStatus = jest.fn().mockReturnThis();
const mockSend = jest.fn();
const mockNext = jest.fn();

const request = {
  headers: {
    authorization: "",
  },
} as any;

const response = {
  locals: {},
  status: mockStatus,
  send: mockSend,
} as any;

describe("can authenticate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete response.locals.userId;
  });
  test("grants access if idToken is valid", async () => {
    (getUserId as jest.Mock).mockResolvedValue(FAKE_ID);
    await auth(request, response, mockNext);
    expect(response.locals.userId).toBe(FAKE_ID);
    expect(mockNext).toHaveBeenCalled();
  });

  test("denies access if idToken is invalid", async () => {
    (getUserId as jest.Mock).mockRejectedValue({});
    await auth(request, response, mockNext);
    expect(response.locals.userId).toBeFalsy();
    expect(mockNext).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.send).toHaveBeenCalledWith(UNAUTHORIZED_MESSAGE);
  });
});
