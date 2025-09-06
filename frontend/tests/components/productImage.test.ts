import { render, screen, fireEvent } from '@testing-library/react';
import ProductImage from '../productImage';
import '@testing-library/jest-dom';

// Mock next/image to render a simple img tag in tests
jest.mock('next/image', () => (props: any) => {
  const { src, alt, ...rest } = props;
  return <img src={typeof src === 'string' ? src : '/mock-image.jpg'} alt={alt} {...rest} />;
});

// Mock image paths
jest.mock('@/public/images/product-default.png', () => '/mock-default.png');

describe('ProductImage Component', () => {
  const mockProduct = {
    title: 'Test Product',
    thumbnail: '/thumbnail.jpg',
    images: ['/high-res.jpg'],
  };

  it('renders with default image initially', () => {
    render(<ProductImage product={mockProduct} />);
    const img = screen.getByAltText('Test Product') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('/mock-default.png');
  });

  it('switches to thumbnail on first load', () => {
    render(<ProductImage product={mockProduct} />);
    const img = screen.getByAltText('Test Product') as HTMLImageElement;

    // Simulate default image load
    fireEvent.load(img);
    expect(img.src).toContain('/thumbnail.jpg');
  });

  it('switches to high resolution on second load', () => {
    render(<ProductImage product={mockProduct} />);
    const img = screen.getByAltText('Test Product') as HTMLImageElement;

    // First load - default → thumbnail
    fireEvent.load(img);
    // Manually trigger re-render by simulating the updated state
    fireEvent.load(img);

    expect(img.src).toContain('/high-res.jpg');
  });
});
