import * as React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { ConnectionTypeFieldType, DropdownField } from '~/concepts/connectionTypes/types';
import DropdownAdvancedPropertiesForm from '~/pages/connectionTypes/manage/advanced/DropdownAdvancedPropertiesForm';

let onChange: jest.Mock;
let onValidate: jest.Mock;
let field: DropdownField;

describe('DropdownFieldAdvancedPropertiesForm', () => {
  beforeEach(() => {
    onChange = jest.fn();
    onValidate = jest.fn();
    field = {
      type: ConnectionTypeFieldType.Dropdown,
      name: 'Test Dropdown',
      envVar: 'TEST_DROPDOWN',
      properties: {},
    };
  });

  it('should show the empty state', () => {
    render(
      <DropdownAdvancedPropertiesForm
        properties={{}}
        field={field}
        onChange={onChange}
        onValidate={onValidate}
      />,
    );

    // default is the expandable form is already open
    expect(screen.getByTestId('radio-single-select')).toBeVisible();
    expect(screen.getByTestId('radio-multi-select')).toBeVisible();
    expect(screen.getAllByTestId('dropdown-item-row').length).toEqual(1);
    expect(screen.getByTestId('dropdown-item-row-label-0')).toHaveValue('');
    expect(screen.getByTestId('dropdown-item-row-value-0')).toHaveValue('');
    expect(screen.getByTestId('dropdown-item-row-remove-0')).toBeDisabled();
    expect(screen.getByTestId('add-dropdown-table-item')).toBeVisible();

    // will preselect 'single' variant on load
    expect(onChange).toBeCalledWith({
      variant: 'single',
    });
  });

  it('should update select type', async () => {
    render(
      <DropdownAdvancedPropertiesForm
        properties={{ variant: 'single' }}
        field={field}
        onChange={onChange}
        onValidate={onValidate}
      />,
    );

    const multiSelect = screen.getByTestId('radio-multi-select');
    act(() => fireEvent.click(multiSelect));
    await waitFor(() =>
      expect(onChange).toHaveBeenNthCalledWith(1, {
        variant: 'multi',
      }),
    );
  });

  it('should update row label and value', async () => {
    render(
      <DropdownAdvancedPropertiesForm
        properties={{
          variant: 'single',
          items: [{ label: 'a', value: 'a' }],
        }}
        field={field}
        onChange={onChange}
        onValidate={onValidate}
      />,
    );

    const itemLabel = screen.getByTestId('dropdown-item-row-label-0');
    act(() => fireEvent.change(itemLabel, { target: { value: 'b' } }));
    expect(onChange).toHaveBeenLastCalledWith({
      variant: 'single',
      items: [{ label: 'b', value: 'a' }],
    });

    const itemValue = screen.getByTestId('dropdown-item-row-value-0');
    act(() => fireEvent.change(itemValue, { target: { value: 'b' } }));
    expect(onChange).toHaveBeenLastCalledWith({
      variant: 'single',
      items: [{ label: 'a', value: 'b' }],
    });
  });

  it('should add row', async () => {
    render(
      <DropdownAdvancedPropertiesForm
        properties={{
          variant: 'single',
          items: [{ label: 'a', value: 'a' }],
        }}
        field={field}
        onChange={onChange}
        onValidate={onValidate}
      />,
    );

    const addButton = screen.getByTestId('add-dropdown-table-item');
    act(() => fireEvent.click(addButton));
    expect(onChange).toHaveBeenLastCalledWith({
      variant: 'single',
      items: [
        { label: 'a', value: 'a' },
        { label: '', value: '' },
      ],
    });
  });

  it('should delete row', async () => {
    render(
      <DropdownAdvancedPropertiesForm
        properties={{
          variant: 'single',
          items: [
            { label: 'a', value: 'a' },
            { label: 'b', value: 'b' },
          ],
        }}
        field={field}
        onChange={onChange}
        onValidate={onValidate}
      />,
    );

    const removeButton = screen.getByTestId('dropdown-item-row-remove-0');
    act(() => fireEvent.click(removeButton));
    expect(onChange).toHaveBeenLastCalledWith({
      variant: 'single',
      items: [{ label: 'b', value: 'b' }],
    });
  });
});