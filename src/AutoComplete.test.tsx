// AutoComplete.test.tsx
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AutoComplete } from './AutoComplete';
import { OptionItem } from './types';

jest.mock('./CloseIcon.svg', () => ({
  ReactComponent: () => <span data-testid="close-icon">x</span>,
}));

describe('AutoComplete (static items)', () => {
  const items: OptionItem<string>[] = [
    { label: 'Apple',  value: 'apple',  icon: '🍎' },
    { label: 'Banana', value: 'banana', icon: '🍌' },
    { label: 'Cherry', value: 'cherry', icon: '🍒' },
  ];

  test('typing filters options and shows icons', async () => {
    render(<AutoComplete items={items} debounceTime={0} />);
    userEvent.type(screen.getByRole('combobox'), 'a');

    await waitFor(() => screen.getByTitle('Apple'));
    await waitFor(() => screen.getByTitle('Banana'));

    const iconTexts = Array.from(
      document.querySelectorAll('.autocomplete-list .icon')
    ).map(el => el.textContent);
    expect(iconTexts).toContain('🍎');
    expect(iconTexts).toContain('🍌');
  });

  test('selecting an option updates input and shows its icon', async () => {
    render(<AutoComplete items={items} debounceTime={0} />);
    const input = screen.getByRole('combobox');
    userEvent.type(input, 'b');

    await waitFor(() => screen.getByTitle('Banana'));
    userEvent.click(screen.getByTitle('Banana'));

    expect((input as HTMLInputElement).value).toBe('Banana');
    expect(screen.getByTestId('close-icon')).toBeTruthy();
    expect(
      (document.querySelector('.input-icon.icon.left') as HTMLElement).textContent
    ).toBe('🍌');
  });

  test('clear button resets input and removes icon', async () => {
    render(<AutoComplete items={items} debounceTime={0} />);
    const input = screen.getByRole('combobox');
    userEvent.type(input, 'c');

    await waitFor(() => screen.getByTitle('Cherry'));
    userEvent.click(screen.getByTitle('Cherry'));

    userEvent.click(screen.getByRole('button', { name: /clear search/i }));
    expect((input as HTMLInputElement).value).toBe('');
    expect(document.querySelector('.input-icon')).toBeNull();
  });
});

describe('AutoComplete (remote fetch)', () => {
  test('loading state shows Loading... and no error', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockImplementation(() => new Promise(() => {}));

    render(
      <AutoComplete
        items={undefined}
        dataSourceUrl="/fake"
        debounceTime={0}
      />
    );

    userEvent.type(screen.getByRole('combobox'), 'x');

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeTruthy();
    });
    expect(screen.queryByText('Error')).toBeNull();
  });

  test('shows loading and then fetch results with icons', async () => {
    const mockData = [
      { label: 'Dog', value: 'dog', icon: '🐶' },
      { label: 'Cat', value: 'cat', icon: '🐱' },
    ];
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as any);

    render(
      <AutoComplete
        items={undefined}
        dataSourceUrl="/fake"
        debounceTime={0}
      />
    );
    const input = screen.getByRole('combobox');

    userEvent.type(input, 'd');
    await waitFor(() => screen.getByTitle('Dog'));

    expect(screen.queryByTitle('Cat')).toBeNull();
    expect(
      Array.from(
        document.querySelectorAll('.autocomplete-list .icon')
      ).map(el => el.textContent)
    ).toContain('🐶');

    userEvent.clear(input);
    userEvent.type(input, 'c');
    await waitFor(() => screen.getByTitle('Cat'));
    expect(screen.queryByTitle('Dog')).toBeNull();
    expect(
      Array.from(
        document.querySelectorAll('.autocomplete-list .icon')
      ).map(el => el.textContent)
    ).toContain('🐱');
  });
});

describe('AutoComplete with custom renderOption', () => {
  const items: OptionItem<string>[] = [
    { label: 'Alpha', value: 'alpha' },
    { label: 'Beta', value: 'beta' },
    { label: 'Gamma', value: 'gamma' },
  ];

  const customRenderer = (opt: OptionItem<string>, isActive: boolean) => (
    <div data-testid="custom">
      {opt.label}:{isActive ? 'ACTIVE' : 'INACTIVE'}
    </div>
  );

  test('renders custom content for matching items', async () => {
    render(
      <AutoComplete
        items={items}
        debounceTime={0}
        renderOption={customRenderer}
      />
    );

    userEvent.type(screen.getByRole('combobox'), 'a');

    await waitFor(() => {
      const nodes = screen.getAllByTestId('custom');
      const texts = nodes.map(n => n.textContent);
      expect(texts).toEqual(
        expect.arrayContaining(['Alpha:INACTIVE', 'Gamma:INACTIVE'])
      );
    });
  });

  test('custom renderer reflects active state on arrow navigation', async () => {
    render(
      <AutoComplete
        items={items}
        debounceTime={0}
        renderOption={customRenderer}
      />
    );

    const input = screen.getByRole('combobox');
    userEvent.type(input, 'a');

    await waitFor(() => {
      const nodes = screen.getAllByTestId('custom');
      expect(nodes.every(n => n.textContent!.endsWith(':INACTIVE'))).toBe(true);
    });

    userEvent.keyboard('{ArrowDown}');

    await waitFor(() => {
      const nodes = screen.getAllByTestId('custom');
      expect(nodes[0].textContent).toBe('Alpha:ACTIVE');
      expect(nodes.slice(1).every(n => n.textContent!.endsWith(':INACTIVE'))).toBe(true);
    });
  });
});