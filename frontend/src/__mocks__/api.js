const API = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
};

export const register = jest.fn();
export const login = jest.fn();
export const logout = jest.fn();
export const getMe = jest.fn();
export const getNotes = jest.fn();
export const getNote = jest.fn();
export const createNote = jest.fn();
export const updateNote = jest.fn();
export const deleteNote = jest.fn();
export const pinNote = jest.fn();
export const archiveNote = jest.fn();
export const trashNote = jest.fn();
export const restoreNote = jest.fn();

export default API;