import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Timer } from '../components/Timer';

// Mock the audio manager
vi.mock('../lib/audio', () => ({
  audioManager: {
    initialize: vi.fn(),
    playTimerComplete: vi.fn(),
  }
}));

describe('Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('displays the correct initial time', () => {
    render(<Timer duration={60} />);
    expect(screen.getByText('1:00')).toBeInTheDocument();
  });

  it('counts down when running', () => {
    render(<Timer duration={60} isRunning={true} />);
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(screen.getByText('0:59')).toBeInTheDocument();
  });

  it('calls onComplete when timer reaches zero', () => {
    const onComplete = vi.fn();
    render(<Timer duration={2} isRunning={true} onComplete={onComplete} />);
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('displays complete status when timer finishes', () => {
    render(<Timer duration={1} isRunning={true} />);
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(screen.getByText('complete')).toBeInTheDocument();
  });

  it('formats time correctly for different durations', () => {
    const { rerender } = render(<Timer duration={125} />);
    expect(screen.getByText('2:05')).toBeInTheDocument();
    
    rerender(<Timer duration={3661} />);
    expect(screen.getByText('61:01')).toBeInTheDocument();
  });

  it('applies custom color', () => {
    render(<Timer duration={60} color="#FF0000" />);
    const progressCircle = document.querySelector('circle[stroke="#FF0000"]');
    expect(progressCircle).toBeInTheDocument();
  });
});
