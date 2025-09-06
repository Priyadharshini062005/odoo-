import { render, screen } from '@testing-library/react';
import Reviews from '../../src/components/reviews';
import '@testing-library/jest-dom';

// Mock next/image to simplify <Image /> rendering
jest.mock('next/image', () => (props: any) => {
  const { src, alt, ...rest } = props;
  return <img src={typeof src === 'string' ? src : '/mock-img.png'} alt={alt} {...rest} />;
});

// Mock star images
jest.mock('@/public/images/star-fill.png', () => '/mock-star-fill.png');
jest.mock('@/public/images/star-empty.png', () => '/mock-star-empty.png');

describe('Reviews Component', () => {
  const mockProduct = {
    reviews: [
      {
        reviewerName: 'Alice',
        rating: 4,
        comment: 'Great product!',
        date: '2023-01-01T00:00:00.000Z',
      },
      {
        reviewerName: 'Bob',
        rating: 2,
        comment: 'Not what I expected.',
        date: '2023-03-15T00:00:00.000Z',
      },
    ],
  };

  it('renders the correct number of reviews', () => {
    render(<Reviews product={mockProduct} />);
    expect(screen.getByText(/Reviews \(2\)/i)).toBeInTheDocument();
  });

  it('displays each review with reviewer name, comment, and date', () => {
    render(<Reviews product={mockProduct} />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Great product!')).toBeInTheDocument();
    expect(screen.getByText('1/1/2023')).toBeInTheDocument();

    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Not what I expected.')).toBeInTheDocument();
    expect(screen.getByText('3/15/2023')).toBeInTheDocument();
  });

  it('renders the correct number of filled and empty stars per review', () => {
    render(<Reviews product={mockProduct} />);
    const images = screen.getAllByAltText('star');

    // Alice: 4 filled, 1 empty → 5 stars
    // Bob: 2 filled, 3 empty → 5 stars
    // Total = 10 stars
    expect(images).toHaveLength(10);
  });

  it('renders 0 reviews gracefully', () => {
    const emptyProduct = { reviews: [] };
    render(<Reviews product={emptyProduct} />);
    expect(screen.getByText(/Reviews \(0\)/i)).toBeInTheDocument();
  });
});
