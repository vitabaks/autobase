import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import '@shared/i18n/i18n.ts';
import UpgradeToEnterprise from './index';

afterEach(cleanup);

describe('UpgradeToEnterprise', () => {
  it('opens the edition comparison and links to current pricing', async () => {
    const user = userEvent.setup();

    render(<UpgradeToEnterprise />);

    await user.click(screen.getByRole('button', { name: 'Upgrade' }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Upgrade to Autobase Enterprise' })).toBeInTheDocument();
    expect(screen.getByText('Community Edition')).toBeInTheDocument();
    expect(screen.getByText('Enterprise Edition')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Enterprise Edition/ })).toHaveAttribute(
      'href',
      'https://autobase.tech/docs#getting-started',
    );
    expect(screen.getByRole('link', { name: 'View plans and pricing' })).toHaveAttribute(
      'href',
      'https://autobase.tech/pricing',
    );
  });

  it('marks Community Edition limitations with minus icons', async () => {
    const user = userEvent.setup();
    render(<UpgradeToEnterprise />);

    await user.click(screen.getByRole('button', { name: 'Upgrade' }));

    const limitations = document.querySelectorAll('[data-feature-kind="limited"]');

    expect(limitations).toHaveLength(2);
    limitations.forEach((limitation) => expect(limitation).toHaveTextContent('−'));
  });

  it('closes the dialog', async () => {
    const user = userEvent.setup();

    render(<UpgradeToEnterprise />);

    await user.click(screen.getByRole('button', { name: 'Upgrade' }));
    const dialog = await screen.findByRole('dialog');
    await user.click(screen.getByRole('button', { name: 'Maybe later' }));

    await waitForElementToBeRemoved(dialog);
  });
});
