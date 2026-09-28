/**
 * Tests for the sample form.
 *
 * WHY THESE EXIST, AND WHAT TO DO WITH THEM WHEN YOU START YOUR OWN FORM.
 *
 * This file is part of the template: it is the worked example of how a BIZUIT custom form is
 * tested. When you replace src/index.tsx with your own form, replace this file too — but keep the
 * shape: render the form the way the host renders it (through `dashboardParams`), wait for the
 * data to arrive, and assert on what the user ends up seeing.
 *
 * The @tyconsa packages are NOT mocked (see the note in jest.config.js). Only the browser APIs
 * jsdom does not implement are replaced.
 */
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FormTemplate from '../index';
import { version as FORM_VERSION } from '../../package.json';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** The value shown in a stats card, found by the card's label. */
function statValue(label: string): string {
  const labelEl = screen.getByText(label);
  return labelEl.nextElementSibling?.textContent?.trim() ?? '';
}

/** Renders the form and waits for the initial (simulated) load to finish. */
async function renderLoaded(params?: Record<string, unknown>) {
  const view = render(<FormTemplate dashboardParams={params as never} />);
  await waitFor(
    () => expect(screen.queryByText('Loading Form Template...')).not.toBeInTheDocument(),
    { timeout: 3000 },
  );
  return view;
}

const dashboardParams = {
  userName: 'Ada Lovelace',
  instanceId: 'instance-4242',
  apiUrl: 'https://example.invalid/tenantBizuitDashboardapi/api',
};

beforeEach(() => {
  // jsdom has no window.alert implementation; the Submit flow calls it.
  jest.spyOn(window, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------

describe('initial load', () => {
  it('shows the loading state before the data arrives', () => {
    render(<FormTemplate dashboardParams={dashboardParams as never} />);

    expect(screen.getByText('Loading Form Template...')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('replaces the loading state with the dashboard once the data arrives', async () => {
    await renderLoaded(dashboardParams);

    expect(screen.getByRole('heading', { name: 'Form Template' })).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Parameters coming from the host
// ---------------------------------------------------------------------------

describe('dashboardParams', () => {
  it('shows the user name and the instance sent by the host', async () => {
    await renderLoaded(dashboardParams);

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText(/instance-4242/)).toBeInTheDocument();
  });

  it('falls back to the development defaults when the host sends nothing', async () => {
    // This is the case the developer sees in dev.html, with no host around.
    await renderLoaded(undefined);

    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText(/dev-instance-001/)).toBeInTheDocument();
  });

  it('shows the version of the form taken from package.json', async () => {
    await renderLoaded(dashboardParams);

    // Header and footer both carry it: the host lists forms by version, and a form that reports
    // a version it was not built from is the classic "the fix is deployed, isn't it?" argument.
    expect(screen.getAllByText(new RegExp(`v?${FORM_VERSION.replace(/\./g, '\\.')}`)).length)
      .toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

describe('stats cards', () => {
  it('counts every item, only the active ones, and totals the amounts', async () => {
    await renderLoaded(dashboardParams);

    // The sample data: 5 items, 4 of them Active, adding up to 9691.50.
    expect(statValue('Total Items')).toBe('5');
    expect(statValue('Active Items')).toBe('4');
    expect(statValue('Total Amount')).toBe('$ 9.7K');
  });
});

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------

describe('data table', () => {
  it('renders one row per item, with its amount formatted', async () => {
    await renderLoaded(dashboardParams);

    const rows = within(screen.getByRole('table')).getAllByRole('row');
    expect(rows).toHaveLength(6); // 1 header + 5 items

    const firstItem = within(rows[1]);
    expect(firstItem.getByText('Example Item 1')).toBeInTheDocument();
    expect(firstItem.getByText('Active')).toBeInTheDocument();
    expect(firstItem.getByText('$1,500.50')).toBeInTheDocument();
  });

  it('shows the empty state, and no table, after Clear', async () => {
    const user = userEvent.setup();
    await renderLoaded(dashboardParams);

    await user.click(screen.getByRole('button', { name: /Clear/i }));

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByText('No hay datos para mostrar')).toBeInTheDocument();
    expect(statValue('Total Items')).toBe('0');
  });

  it('brings the data back with Refresh Data', async () => {
    const user = userEvent.setup();
    await renderLoaded(dashboardParams);

    await user.click(screen.getByRole('button', { name: /Clear/i }));
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Refresh Data/i }));

    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument(), { timeout: 3000 });
    expect(statValue('Total Items')).toBe('5');
  });
});

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

describe('filters', () => {
  it('keeps the category chosen by the user', async () => {
    const user = userEvent.setup();
    await renderLoaded(dashboardParams);

    const category = screen.getByRole('combobox');
    expect(category).toHaveValue('');

    await user.selectOptions(category, 'category2');

    expect(category).toHaveValue('category2');
  });
});

// ---------------------------------------------------------------------------
// Modals
// ---------------------------------------------------------------------------

describe('info modal', () => {
  it('opens from the Details card and closes again', async () => {
    const user = userEvent.setup();
    await renderLoaded(dashboardParams);

    expect(screen.queryByRole('heading', { name: 'Data Information' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Ver detalles' }));
    expect(screen.getByRole('heading', { name: 'Data Information' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('heading', { name: 'Data Information' })).not.toBeInTheDocument();
  });
});

describe('submit modal', () => {
  it('asks for confirmation before submitting, and reports what is being sent', async () => {
    const user = userEvent.setup();
    await renderLoaded(dashboardParams);

    await user.click(screen.getByRole('button', { name: /Submit/i }));

    expect(screen.getByRole('heading', { name: 'Confirm Submission' })).toBeInTheDocument();
    expect(screen.getByText('5 items')).toBeInTheDocument();
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('submits on Confirm and closes the modal', async () => {
    const user = userEvent.setup();
    await renderLoaded(dashboardParams);

    await user.click(screen.getByRole('button', { name: /Submit/i }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('heading', { name: 'Confirm Submission' })).not.toBeInTheDocument();
  });

  it('does not submit when the user cancels', async () => {
    const user = userEvent.setup();
    await renderLoaded(dashboardParams);

    await user.click(screen.getByRole('button', { name: /Submit/i }));
    const modal = screen.getByRole('heading', { name: 'Confirm Submission' }).closest('div.bg-white');
    await user.click(within(modal as HTMLElement).getByRole('button', { name: 'Cancel' }));

    expect(window.alert).not.toHaveBeenCalled();
    expect(screen.queryByRole('heading', { name: 'Confirm Submission' })).not.toBeInTheDocument();
  });
});
