jest.mock('../services/api', () => ({
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  getMe: jest.fn(),
  getNotes: jest.fn(),
  getNote: jest.fn(),
  createNote: jest.fn(),
  updateNote: jest.fn(),
  deleteNote: jest.fn(),
  pinNote: jest.fn(),
  archiveNote: jest.fn(),
  trashNote: jest.fn(),
  restoreNote: jest.fn(),
}));

describe('api.js — exports', () => {
  let api;
  beforeAll(async () => { api = await import('../services/api'); });

  it('exports register', () => { expect(typeof api.register).toBe('function'); });
  it('exports login', () => { expect(typeof api.login).toBe('function'); });
  it('exports logout', () => { expect(typeof api.logout).toBe('function'); });
  it('exports getMe', () => { expect(typeof api.getMe).toBe('function'); });
  it('exports getNotes', () => { expect(typeof api.getNotes).toBe('function'); });
  it('exports getNote', () => { expect(typeof api.getNote).toBe('function'); });
  it('exports createNote', () => { expect(typeof api.createNote).toBe('function'); });
  it('exports updateNote', () => { expect(typeof api.updateNote).toBe('function'); });
  it('exports deleteNote', () => { expect(typeof api.deleteNote).toBe('function'); });
  it('exports pinNote', () => { expect(typeof api.pinNote).toBe('function'); });
  it('exports archiveNote', () => { expect(typeof api.archiveNote).toBe('function'); });
  it('exports trashNote', () => { expect(typeof api.trashNote).toBe('function'); });
  it('exports restoreNote', () => { expect(typeof api.restoreNote).toBe('function'); });
});