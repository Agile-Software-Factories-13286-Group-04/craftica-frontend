import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import { AuthProvider } from '@/context/AuthContext';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with no user', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('should load user from localStorage', () => {
    const mockUser = { id: '1', nombre: 'Test', correo: 'test@test.com' };
    const mockToken = 'mock-token';
    
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'craftica_user') return JSON.stringify(mockUser);
      if (key === 'craftica_token') return mockToken;
      return null;
    });
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
  });
});