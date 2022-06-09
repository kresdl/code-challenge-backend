import { unsubscribe } from "..";
import { deleteUser } from "../../models";

const FAKE_ID = "fake-id";

jest.mock("../../models");

const mockStatus = jest.fn().mockReturnThis();
const mockSend = jest.fn();
const mockNext = jest.fn();
const mockDeleteUser = (deleteUser as jest.Mock).mockResolvedValue({});

const request = {
  params: {},
} as any;

const response = {
  status: mockStatus,
  send: mockSend,
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
    await unsubscribe(request, response, mockNext);
    expect(mockDeleteUser).toHaveBeenCalledWith(FAKE_ID);
    expect(mockStatus).toHaveBeenCalledWith(200);
  });

  test("through link", async () => {
    request.params.userId = FAKE_ID;
    await unsubscribe(request, response, mockNext);
    expect(mockDeleteUser).toHaveBeenCalledWith(FAKE_ID);
    expect(mockStatus).toHaveBeenCalledWith(200);
  });
});
