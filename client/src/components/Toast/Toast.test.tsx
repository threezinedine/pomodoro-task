import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ToastContainer } from './ToastContainer';
import { toast } from '../../utils/toast';

describe('Toast Singleton & Component', () => {
  // Clear any existing toasts between tests
  beforeEach(() => {
    toast.clearAll();
  });

  it('renders the toast message in the DOM when triggered', async () => {
    render(<ToastContainer />);
    
    act(() => {
      toast.success('Task finished correctly');
    });

    const element = await screen.findByText('Task finished correctly');
    expect(element).toBeInTheDocument();
  });

  it('renders correct variant colors/classes', async () => {
    render(<ToastContainer />);
    
    act(() => {
      toast.error('Fatal crash');
    });

    const element = await screen.findByText('Fatal crash');
    // The parent element containing the text is the wrapper
    const wrapper = element.closest('.toast-message');
    expect(wrapper).toHaveClass('toast-message--error');
  });

  it('auto-dismisses after the timeout duration completes', async () => {
    vi.useFakeTimers();
    render(<ToastContainer />);
    
    act(() => {
      toast.info('Temporary message', 1000);
    });

    expect(screen.getByText('Temporary message')).toBeInTheDocument();
    
    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(1100);
    });

    expect(screen.queryByText('Temporary message')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('manually dismisses immediately when the X button is clicked', async () => {
    render(<ToastContainer />);
    
    act(() => {
      toast.error('Close me now', 5000); // long duration so it doesn't auto-dismiss
    });

    expect(screen.getByText('Close me now')).toBeInTheDocument();
    
    const closeBtn = screen.getByRole('button', { name: /close toast/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByText('Close me now')).not.toBeInTheDocument();
  });

  it('stacks multiple toasts in the DOM queue', async () => {
    render(<ToastContainer />);
    
    act(() => {
      toast.success('First');
      toast.success('Second');
      toast.success('Third');
    });

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
    
    // There should be 3 active toast messages rendered
    const wrappers = document.querySelectorAll('.toast-message');
    expect(wrappers.length).toBe(3);
  });
});
