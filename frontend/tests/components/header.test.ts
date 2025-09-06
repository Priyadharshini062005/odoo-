import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Header from '../../src/components/header';
import '@testing-library/jest-dom';
import { useAppSelector, useAppDispatch } from '../../src/handlers/redux/hooks';
import { useRouter } from 'next/navigation';

// Mocks
jest.mock('../../handlers/redux/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('next/image', () => (props: any) => <img {...props} />);
jest.mock('../signinModal', () => () => <div>SignInModal</div>);
jest.mock('../registerModal', () => () => <div>RegisterModal</div>);

describe('Header Component', () => {
  const mockDispatch = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  const mockCart = { totalQuantity: 3 };

  const setup = (user: any = null) => {
    (useAppSelector as jest.Mock).mockImplementation((selectorFn: any) => {
      if (selectorFn.name.includes('auth')) return { user };
      if (selectorFn.name.includes('carts')) return { cart: mockCart };
      return {};
    });

    return render(<Header />);
  };

  it('renders logo and navigation links', async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByAltText('GMP')).toBeInTheDocument();
      expect(screen.getByText('Sustainability')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });
  });

  it('shows Sign In and Register when user is not logged in', async () => {
    setup(null);

    expect(await screen.findByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('shows user avatar and name when logged in', async () => {
    const user = {
      name: 'John Doe',
      avatar: { avatarUrl: '/avatar.jpg' },
    };

    setup(user);

    expect(await screen.findByText('Hello, John Doe')).toBeInTheDocument();
    expect(screen.getByAltText(`John Doe's avatar`)).toBeInTheDocument();
  });

  it('toggles dropdown on avatar click', async () => {
    const user = {
      name: 'Jane',
      avatar: { avatarUrl: '/avatar.jpg' },
    };

    setup(user);

    const avatarButton = await screen.findByText(/Hello, Jane/i);
    fireEvent.click(avatarButton);

    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  it('calls logout and redirects when clicking Logout', async () => {
    const user = {
      name: 'Jane',
      avatar: { avatarUrl: '/avatar.jpg' },
    };

    setup(user);

    fireEvent.click(screen.getByText(/Hello, Jane/i));

    const logoutBtn = await screen.findByText('Logout');
    fireEvent.click(logoutBtn);

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('shows cart icon with badge when items in cart', async () => {
    setup();

    const cartBadge = await screen.findByText('3');
    expect(cartBadge).toBeInTheDocument();
  });

  it('executes search when submitting the form', async () => {
    setup();

    const input = screen.getByPlaceholderText('Search products...');
    fireEvent.change(input, { target: { value: 'banana' } });

    fireEvent.submit(input.closest('form')!);

    expect(input).toHaveValue('');
  });
});
