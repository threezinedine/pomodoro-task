import type { Meta, StoryObj } from '@storybook/react';
import { ToastContainer } from './ToastContainer';
import { toast } from '../../utils/toast';
import { Button } from '../Button/Button';

// A wrapper to demonstrate how the singleton works outside the component
const ToastDemo = () => {
  return (
    <div style={{ padding: '2rem', display: 'flex', gap: '1rem', flexDirection: 'column', alignItems: 'flex-start' }}>
      <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
        The ToastContainer is rendered once at the app root. 
        Click these buttons to trigger the singleton anywhere in the app tree!
      </p>
      
      {/* The invisible container that usually lives in App.tsx */}
      <ToastContainer />
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button variant="primary" onClick={() => toast.success('Workspace securely saved!')}>
          Trigger Success
        </Button>
        <Button variant="outline" onClick={() => toast.error('Database connection failed', 5000)}>
          Trigger Error (5s)
        </Button>
        <Button variant="secondary" onClick={() => toast.warning('High memory usage detected')}>
          Trigger Warning
        </Button>
        <Button variant="secondary" onClick={() => toast.info('New app update available')}>
          Trigger Info
        </Button>
      </div>
      <div style={{ marginTop: '1rem' }}>
         <Button variant="ghost" onClick={() => {
            toast.success('File uploaded!');
            setTimeout(() => toast.info('Processing...'), 400);
            setTimeout(() => toast.success('Done!'), 1000);
         }}>
           Trigger Queue Surge
         </Button>
      </div>
    </div>
  );
};

const meta = {
  title: 'UI/Toast',
  component: ToastDemo,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ToastDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InteractiveDemo: Story = {};
