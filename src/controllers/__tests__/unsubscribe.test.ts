import { unsubscribe } from "..";
import { deleteUser } from "../../models";

const FAKE_ID = "fake-id";

jest.mock("../../models", () => ({
  deleteUser: jest.fn(),
}));

const mockStatus = jest.fn().mockReturnThis();
const mockSend = jest.fn();
const mockSendStatus = jest.fn();
const mockNext = jest.fn();

const request = {
  params: {},
} as any;

const response = {
  status: mockStatus,
  send: mockSend,
  sendStatus: mockSendStatus,
  locals: {},
} as any;

describe("can signout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete response.locals.userId;
    delete request.params.userId;
  });

  test("with implicit user id", async () => {
    response.locals.userId = FAKE_ID;
    const mockDeleteUser = (deleteUser as jest.Mock).mockResolvedValue(true);
    await unsubscribe(request, response, mockNext);
    expect(mockDeleteUser).toHaveBeenCalledWith(FAKE_ID);
    expect(mockStatus).toHaveBeenCalledWith(200);
  });

  test("through link", async () => {
    request.params.userId = FAKE_ID;
    const mockDeleteUser = (deleteUser as jest.Mock).mockResolvedValue(true);
    await unsubscribe(request, response, mockNext);
    expect(mockDeleteUser).toHaveBeenCalledWith(FAKE_ID);
    expect(mockStatus).toHaveBeenCalledWith(200);
  });

  test("responds appropriately when user does not exist", async () => {
    request.params.userId = FAKE_ID;
    const mockDeleteUser = (deleteUser as jest.Mock).mockResolvedValue(false);
    await unsubscribe(request, response, mockNext);
    expect(mockDeleteUser).toHaveBeenCalledWith(FAKE_ID);
    expect(mockSendStatus).toHaveBeenCalledWith(404);
  });
});
