import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../Button/Button';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    shadow: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// A helper layout to show what typically goes inside a card
const CardContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '300px' }}>
    <h2 style={{ margin: 0 }}>Login</h2>
    <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
      Sign in to manage your time effectively.
    </p>
    <Button fullWidth variant="primary">Continue</Button>
  </div>
);

export const Default: Story = {
  args: {
    padding: 'md',
    shadow: 'sm',
    children: <CardContent />,
  },
};

export const LargeShadowAndPadding: Story = {
  args: {
    padding: 'lg',
    shadow: 'lg',
    children: <CardContent />,
  },
};
