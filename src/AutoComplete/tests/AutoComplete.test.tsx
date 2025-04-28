import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OptionItem } from '../../types';
import { AutoComplete } from '../AutoComplete';

jest.mock('../CloseIcon.svg', () => ({
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

    const apple = await screen.findByTitle('Apple');
    expect(apple).not.toBeNull();

    const banana = await screen.findByTitle('Banana');
    expect(banana).not.toBeNull();

    const appleIcon = screen.getByText('🍎');
    expect(appleIcon).not.toBeNull();

    const bananaIcon = screen.getByText('🍌');
    expect(bananaIcon).not.toBeNull();
  });

  test('selecting an option updates input and shows its icon', async () => {
    render(<AutoComplete items={items} debounceTime={0} />);
    userEvent.type(screen.getByRole('combobox'), 'b');

    const banana = await screen.findByTitle('Banana');
    userEvent.click(banana);

    const input = screen.getByRole('combobox') as HTMLInputElement;
    expect(input.value).toBe('Banana');

    const clearIcon = screen.getByTestId('close-icon');
    expect(clearIcon).not.toBeNull();

    const bananaIcon = screen.getByText('🍌');
    expect(bananaIcon).not.toBeNull();
  });

  test('clear button resets input and removes icon', async () => {
    render(<AutoComplete items={items} debounceTime={0} />);
    userEvent.type(screen.getByRole('combobox'), 'c');

    const cherry = await screen.findByTitle('Cherry');
    userEvent.click(cherry);

    const clearBtn = screen.getByRole('button', { name: /clear search/i });
    userEvent.click(clearBtn);

    const input = screen.getByRole('combobox') as HTMLInputElement;
    expect(input.value).toBe('');
    expect(screen.queryByTestId('close-icon')).toBeNull();
    expect(screen.queryByText('🍒')).toBeNull();
  });
});

describe('AutoComplete (remote fetch)', () => {
  test('loading state shows Loading... and no error', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => new Promise(() => {}));

    render(
      <AutoComplete
        items={undefined}
        dataSourceUrl="/fake"
        debounceTime={0}
      />
    );
    userEvent.type(screen.getByRole('combobox'), 'x');

    const loading = await screen.findByText('Loading...');
    expect(loading).not.toBeNull();
    expect(screen.queryByText(/^Error/)).toBeNull();
  });

  test('shows fetch results with icons', async () => {
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
    userEvent.type(screen.getByRole('combobox'), 'd');

    const dog = await screen.findByTitle('Dog');
    expect(dog).not.toBeNull();
    expect(screen.queryByTitle('Cat')).toBeNull();

    const dogIcon = screen.getByText('🐶');
    expect(dogIcon).not.toBeNull();

    userEvent.clear(screen.getByRole('combobox'));
    userEvent.type(screen.getByRole('combobox'), 'c');

    const cat = await screen.findByTitle('Cat');
    expect(cat).not.toBeNull();
    expect(screen.queryByTitle('Dog')).toBeNull();

    const catIcon = screen.getByText('🐱');
    expect(catIcon).not.toBeNull();
  });
});

describe('AutoComplete with custom renderOption', () => {
  const items: OptionItem<string>[] = [
    { label: 'Alpha', value: 'alpha' },
    { label: 'Beta',  value: 'beta' },
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

    const nodes = await screen.findAllByTestId('custom');
    const texts = nodes.map(n => n.textContent);
    expect(texts).toEqual(
      expect.arrayContaining(['Alpha:INACTIVE', 'Gamma:INACTIVE'])
    );
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

    let nodes = await screen.findAllByTestId('custom');
    expect(nodes.every(n => n.textContent!.endsWith(':INACTIVE'))).toBe(true);

    userEvent.keyboard('{ArrowDown}');
    nodes = await screen.findAllByTestId('custom');
    expect(nodes[0].textContent).toBe('Alpha:ACTIVE');
    expect(nodes.slice(1).every(n => n.textContent!.endsWith(':INACTIVE'))).toBe(true);
  });
});
