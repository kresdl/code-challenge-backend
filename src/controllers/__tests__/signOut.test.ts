import { signOut } from "../";
import { deleteUser } from "../../models";

const FAKE_ID = "fake-id";

jest.mock("../../models");

const mockStatus = jest.fn().mockReturnThis();
const mockSend = jest.fn();
const mockSendStatus = jest.fn();
const mockNext = jest.fn();
const mockDeleteUser = (deleteUser as jest.Mock).mockResolvedValue({});

const request = {} as any;

const response = {
  locals: { userId: FAKE_ID },
  status: mockStatus,
  send: mockSend,
  sendStatus: mockSendStatus,
} as any;

test("can signout", async () => {
  await signOut(request, response, mockNext);
  expect(mockDeleteUser).toHaveBeenCalledWith(FAKE_ID);
  expect(mockSendStatus).toHaveBeenCalledWith(200);
});
