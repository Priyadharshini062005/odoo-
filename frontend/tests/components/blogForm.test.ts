import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BlogForm from '../../src/components/blogForm';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('BlogForm Component', () => {
  const mockBack = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ back: mockBack });
  });

  it('renders form fields and submit button', () => {
    render(<BlogForm onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Author')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Content')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('calls onSubmit with correct values when submitted', () => {
    render(<BlogForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'Test Blog' },
    });
    fireEvent.change(screen.getByPlaceholderText('Author'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Content'), {
      target: { value: 'This is test content' },
    });

    fireEvent.click(screen.getByText('Submit'));

    expect(mockOnSubmit).toHaveBeenCalledWith(
      'Test Blog',
      'John Doe',
      'This is test content',
      undefined
    );
  });

  it('displays preview when image is uploaded', async () => {
    render(<BlogForm onSubmit={mockOnSubmit} />);

    const file = new File(['image content'], 'example.jpg', { type: 'image/jpeg' });

    const input = screen.getByLabelText(/file/i) || screen.getByDisplayValue('');

    fireEvent.change(screen.getByLabelText(/file/i), {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(screen.getByText('Image Preview:')).toBeInTheDocument();
    });
  });

  it('prefills data when initialData is provided', () => {
    const initialData = {
      title: 'Initial Title',
      author: 'Initial Author',
      content: 'Initial Content',
      imageFile: {
        filename: 'image.jpg',
        imageUrl: 'http://example.com/image.jpg',
      },
    };

    render(<BlogForm onSubmit={mockOnSubmit} initialData={initialData} />);

    expect(screen.getByDisplayValue('Initial Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Initial Author')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Initial Content')).toBeInTheDocument();
    expect(screen.getByAltText('Preview')).toBeInTheDocument();
  });

  it('calls router.back() when back button is clicked', () => {
    render(<BlogForm onSubmit={mockOnSubmit} />);

    const backButton = screen.getByRole('button');
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalled();
  });
});
