import { render } from '@testing-library/react';
import HomePage from '../page';

describe('HomePage', () => {
  it('renders the homepage without crashing', () => {
    render(<HomePage />);
    // Basic test to ensure the page renders without errors
  });
});