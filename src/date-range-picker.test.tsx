import React from 'react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { DateRangePicker } from './date-range-picker'
import timezoneMock from 'timezone-mock'

describe('DateRangePicker', () => {
  beforeEach(() => {
    timezoneMock.register('UTC')
  })

  afterEach(() => {
    timezoneMock.unregister()
  })

  it('should render without crashing', () => {
    const { getByText } = render(<DateRangePicker initialDateFrom="2023-01-01" initialDateTo="2023-12-31" />)
    expect(getByText(/Jan 1, 2023 - Dec 31, 2023/)).toBeInTheDocument()
  })

  it('should display the PopoverContent when PopoverTrigger button is clicked', () => {
    const { getAllByRole } = render(<DateRangePicker initialDateFrom="2023-01-01" initialDateTo="2023-12-31" />)

    // Assume that the button text can be "Jan 1, 2023 - Dec 31, 2023"
    const buttons = getAllByRole('button', { name: /Jan 1, 2023 - Dec 31, 2023/i })
    const triggerButton = buttons[0] // assuming the trigger button is the first one
    fireEvent.click(triggerButton)

    // Check if "Update" button in PopoverContent is visible now
    expect(getAllByRole('button', { name: /Update/i })[0]).toBeVisible()
  })

  it.skip('should call onUpdate with the correct value when date is selected', async () => {
    const onUpdateMock = jest.fn()
    const { getAllByRole, getAllByPlaceholderText } = render(
      <DateRangePicker initialDateFrom="2023-01-01" initialDateTo="2023-12-31" onUpdate={onUpdateMock} />
    )

    // Assume that the button text can be "Jan 1, 2023 - Dec 31, 2023"
    let buttons = getAllByRole('button', { name: /Jan 1, 2023 - Dec 31, 2023/i })
    const triggerButton = buttons[0] // assuming the trigger button is the first one
    fireEvent.click(triggerButton)

    // Get all input fields with placeholder text 'MM'
    const monthInputs = getAllByPlaceholderText('M')
    const dateFromMonthInput = monthInputs[0]
    const dateToMonthInput = monthInputs[1]

    const dayInputs = getAllByPlaceholderText('D')
    const dateFromDayInput = dayInputs[0]
    const dateToDayInput = dayInputs[1]

    const yearInputs = getAllByPlaceholderText('YYYY')
    const dateFromYearInput = yearInputs[0]
    const dateToYearInput = yearInputs[1]

    // Change the date range
    fireEvent.change(dateFromMonthInput, { target: { value: '02' } })
    fireEvent.change(dateFromDayInput, { target: { value: '01' } })
    fireEvent.change(dateFromYearInput, { target: { value: '2023' } })
    fireEvent.change(dateToMonthInput, { target: { value: '03' } })
    fireEvent.change(dateToDayInput, { target: { value: '30' } })
    fireEvent.change(dateToYearInput, { target: { value: '2023' } })

    // Click the Update button
    buttons = getAllByRole('button', { name: /Update/i })
    const updateButton = buttons[0]
    fireEvent.click(updateButton)

    // Check if onUpdate is called with the correct value
    await waitFor(() => {
      expect(onUpdateMock).toHaveBeenCalledWith({
        range: {
          from: new Date(Date.UTC(2023, 1, 1)),
          to: new Date(Date.UTC(2023, 2, 30))
        },
        rangeCompare: undefined
      })
    })
  })

  it.skip('should call onUpdate with the correct value when compare toggle is switched on', async () => {
    const onUpdateMock = jest.fn()
    const { getAllByRole, getByRole, getAllByPlaceholderText } = render(
      <DateRangePicker showCompare={true} initialDateFrom="2023-01-01" initialDateTo="2023-12-31" onUpdate={onUpdateMock} />
    )

    // Assume that the button text can be "Jan 1, 2023 - Dec 31, 2023"
    let buttons = getAllByRole('button', { name: /Jan 1, 2023 - Dec 31, 2023/i })
    const triggerButton = buttons[0] // assuming the trigger button is the first one
    fireEvent.click(triggerButton)

    // Get all input fields with placeholder text 'MM'
    const monthInputs = getAllByPlaceholderText('M')
    const dateFromMonthInput = monthInputs[0]
    const dateToMonthInput = monthInputs[1]

    const dayInputs = getAllByPlaceholderText('D')
    const dateFromDayInput = dayInputs[0]
    const dateToDayInput = dayInputs[1]

    const yearInputs = getAllByPlaceholderText('YYYY')
    const dateFromYearInput = yearInputs[0]
    const dateToYearInput = yearInputs[1]

    // Change the date range
    fireEvent.change(dateFromMonthInput, { target: { value: '02' } })
    fireEvent.change(dateFromDayInput, { target: { value: '01' } })
    fireEvent.change(dateFromYearInput, { target: { value: '2023' } })
    fireEvent.change(dateToMonthInput, { target: { value: '03' } })
    fireEvent.change(dateToDayInput, { target: { value: '30' } })
    fireEvent.change(dateToYearInput, { target: { value: '2023' } })

    const compareSwitch = getByRole('switch', { name: /compare/i })
    fireEvent.click(compareSwitch)

    // Click the Update button
    buttons = getAllByRole('button', { name: /Update/i })
    const updateButton = buttons[0]
    fireEvent.click(updateButton)

    // Expect the `onUpdate` prop to have been called with the correct arguments.
    // The expected arguments include the initial date range and a new compare range
    // that starts 365 days before the initial range.
    const expectedFrom = new Date(Date.UTC(2023, 1, 1))
    const expectedTo = new Date(Date.UTC(2023, 2, 30))
    const expectedCompareFrom = new Date(Date.UTC(2023, 1, 1))
    expectedCompareFrom.setDate(expectedCompareFrom.getDate() - 365)
    const expectedCompareTo = new Date(Date.UTC(2023, 2, 30))
    expectedCompareTo.setDate(expectedCompareTo.getDate() - 365)

    // Check if onUpdate is called with the correct value
    await waitFor(() => {
      expect(onUpdateMock).toHaveBeenCalledWith({
        range: {
          from: expectedFrom,
          to: expectedTo
        },
        rangeCompare: {
          from: expectedCompareFrom,
          to: expectedCompareTo
        }
      })
    })
  })

  describe('Translations', () => {
    it('should render with default English translations', () => {
      const { getByRole, getAllByRole } = render(<DateRangePicker initialDateFrom="2023-01-01" initialDateTo="2023-12-31" />)

      // Click to open popover
      const triggerButton = getAllByRole('button', { name: /Jan 1, 2023 - Dec 31, 2023/i })[0]
      fireEvent.click(triggerButton)

      // Check English preset labels
      // expect(getByRole('button', { name: /Today/i })).toBeInTheDocument()
      expect(getByRole('button', { name: /Yesterday/i })).toBeInTheDocument()
      // expect(getByRole('button', { name: /Last 7 days/i })).toBeInTheDocument()

      // Check English action buttons
      expect(getByRole('button', { name: /Update/i })).toBeInTheDocument()
      expect(getByRole('button', { name: /Cancel/i })).toBeInTheDocument()

      // Check English compare label
      expect(getByRole('switch', { name: /Compare/i })).toBeInTheDocument()
    })

    it('should render with Portuguese translations when locale is pt-BR', () => {
      const { getByRole, getAllByRole } = render(
        <DateRangePicker
          locale="pt-BR"
          initialDateFrom="2023-01-01"
          initialDateTo="2023-12-31"
        />
      )

      // Click to open popover
      const triggerButton = getAllByRole('button')[0]
      fireEvent.click(triggerButton)

      // Check Portuguese preset labels
      // expect(getByRole('button', { name: /Hoje/i })).toBeInTheDocument()
      expect(getByRole('button', { name: /Ontem/i })).toBeInTheDocument()
      // expect(getByRole('button', { name: /Últimos 7 dias/i })).toBeInTheDocument()
      // expect(getByRole('button', { name: /Esta Semana/i })).toBeInTheDocument()

      // Check Portuguese action buttons
      expect(getByRole('button', { name: /Atualizar/i })).toBeInTheDocument()
      expect(getByRole('button', { name: /Cancelar/i })).toBeInTheDocument()

      // Check Portuguese compare label
      expect(getByRole('switch', { name: /Comparar/i })).toBeInTheDocument()
    })

    it('should override specific translations with custom translations prop', () => {
      const { getByRole, getAllByRole } = render(
        <DateRangePicker
          locale="pt-BR"
          translations={{
            presets: { yesterday: 'Ontem mesmo' },
            actions: { update: 'Aplicar' }
          } as any}
          initialDateFrom="2023-01-01"
          initialDateTo="2023-12-31"
        />
      )

      // Click to open popover
      const triggerButton = getAllByRole('button')[0]
      fireEvent.click(triggerButton)

      // Check custom overrides
      expect(getByRole('button', { name: /Ontem mesmo/i })).toBeInTheDocument()
      expect(getByRole('button', { name: /Aplicar/i })).toBeInTheDocument()

      // Check that non-overridden Portuguese translations are still used
      expect(getByRole('button', { name: /Ontem/i })).toBeInTheDocument()
      expect(getByRole('button', { name: /Cancelar/i })).toBeInTheDocument()
    })

    it('should fallback to English when unsupported locale is used', () => {
      const { getByRole, getAllByRole } = render(
        <DateRangePicker
          locale="fr-FR"
          initialDateFrom="2023-01-01"
          initialDateTo="2023-12-31"
        />
      )

      // Click to open popover
      const triggerButton = getAllByRole('button')[0]
      fireEvent.click(triggerButton)

      // Should fallback to English translations
      // expect(getByRole('button', { name: /Today/i })).toBeInTheDocument()
      expect(getByRole('button', { name: /Yesterday/i })).toBeInTheDocument()
      expect(getByRole('button', { name: /Update/i })).toBeInTheDocument()
      expect(getByRole('button', { name: /Cancel/i })).toBeInTheDocument()
    })

    it('should use custom English translations when only translations prop is provided', () => {
      const { getByRole, getAllByRole } = render(
        <DateRangePicker
          translations={{
            presets: { yesterday: 'Right Now' },
            actions: { update: 'Apply Changes', cancel: 'Discard' }
          } as any}
          initialDateFrom="2023-01-01"
          initialDateTo="2023-12-31"
        />
      )

      // Click to open popover
      const triggerButton = getAllByRole('button')[0]
      fireEvent.click(triggerButton)

      // Check custom English overrides
      expect(getByRole('button', { name: /Right Now/i })).toBeInTheDocument()
      expect(getByRole('button', { name: /Apply Changes/i })).toBeInTheDocument()
      expect(getByRole('button', { name: /Discard/i })).toBeInTheDocument()

      // Check that non-overridden English translations are still used
      expect(getByRole('button', { name: /Last Month/i })).toBeInTheDocument()
    })
  })
})
