import React, { useEffect, useRef } from 'react'

interface DateInputProps {
  value?: Date
  onChange: (date: Date) => void
  locale?: string
  minDate?: Date
  maxDate?: Date
}

interface DateParts {
  day: number
  month: number
  year: number
}

// Helper function to determine if locale uses DD/MM/YYYY format
const usesDayMonthYear = (locale: string): boolean => {
  // Locales that typically use DD/MM/YYYY format
  const dayFirstLocales = ['pt-BR', 'pt-PT', 'en-GB', 'en-AU', 'fr-FR', 'de-DE', 'es-ES', 'it-IT', 'nl-NL', 'sv-SE', 'da-DK', 'nb-NO']
  return dayFirstLocales.some(l => locale.startsWith(l.split('-')[0]) && locale !== 'en-US')
}

const DateInput: React.FC<DateInputProps> = ({ value, onChange, locale = 'en-US', minDate, maxDate }) => {
  const isDayFirst = usesDayMonthYear(locale)
  const [date, setDate] = React.useState<DateParts>(() => {
    const d = value ? new Date(value) : new Date()
    return {
      day: d.getDate(),
      month: d.getMonth() + 1, // JavaScript months are 0-indexed
      year: d.getFullYear()
    }
  })

  const monthRef = useRef<HTMLInputElement | null>(null)
  const dayRef = useRef<HTMLInputElement | null>(null)
  const yearRef = useRef<HTMLInputElement | null>(null)
  const isEditingRef = useRef<boolean>(false)

  useEffect(() => {
    // Don't sync with parent value while user is actively editing
    if (isEditingRef.current) return

    const d = value ? new Date(value) : new Date()
    setDate({
      day: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear()
    })
  }, [value])

  const validateDate = (field: keyof DateParts, value: number): boolean => {
    if (
      (field === 'day' && (value < 1 || value > 31)) ||
      (field === 'month' && (value < 1 || value > 12)) ||
      (field === 'year' && (value < 1000 || value > 9999))
    ) {
      return false
    }

    // Validate the day of the month
    const newDate = { ...date, [field]: value }
    const d = new Date(newDate.year, newDate.month - 1, newDate.day)
    return d.getFullYear() === newDate.year &&
           d.getMonth() + 1 === newDate.month &&
           d.getDate() === newDate.day
  }

  const handleInputChange =
    (field: keyof DateParts) => (e: React.ChangeEvent<HTMLInputElement>) => {
      // Mark that user is actively editing
      isEditingRef.current = true

      const newValue = e.target.value ? Number(e.target.value) : ''

      // Validate BEFORE updating state
      const isValid = typeof newValue === 'number' && validateDate(field, newValue)

      if (!isValid) {
        // Keep old value if invalid - don't update state
        return
      }

      // Build tentative date with typed value
      const newDate = { ...date, [field]: newValue }
      const tentativeDate = new Date(newDate.year, newDate.month - 1, newDate.day)

      // Pre-emptive boundary check - reject invalid dates before updating state
      if (minDate && tentativeDate < minDate) {
        return // Don't accept dates before minDate
      }

      if (maxDate && tentativeDate > maxDate) {
        return // Don't accept dates after maxDate
      }

      // All validations passed - accept the input
      setDate(newDate)
      onChange(tentativeDate)
    }

  const initialDate = useRef<DateParts>(date)

  const handleBlur = (field: keyof DateParts) => (
    e: React.FocusEvent<HTMLInputElement>
  ): void => {
    // User finished editing, allow parent sync again
    isEditingRef.current = false

    if (!e.target.value) {
      setDate(initialDate.current)
      return
    }

    const newValue = Number(e.target.value)
    const isValid = validateDate(field, newValue)

    if (!isValid) {
      setDate(initialDate.current)
    } else {
      // If the new value is valid, update the initial value
      initialDate.current = { ...date, [field]: newValue }

      // Validate against min/max date boundaries
      const newDate = { ...date, [field]: newValue }
      const finalDate = new Date(newDate.year, newDate.month - 1, newDate.day)

      // Clamp date to valid range
      let clampedDate = finalDate
      if (minDate && finalDate < minDate) {
        clampedDate = minDate
      } else if (maxDate && finalDate > maxDate) {
        clampedDate = maxDate
      }

      // If date was clamped, update state and notify parent
      if (clampedDate.getTime() !== finalDate.getTime()) {
        const clampedParts = {
          day: clampedDate.getDate(),
          month: clampedDate.getMonth() + 1,
          year: clampedDate.getFullYear()
        }
        setDate(clampedParts)
        initialDate.current = clampedParts
        onChange(clampedDate)
      }
    }
  }

  const handleKeyDown =
    (field: keyof DateParts) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow command (or control) combinations
      if (e.metaKey || e.ctrlKey) {
        return
      }

      // Prevent non-numeric characters, excluding allowed keys
      if (
        !/^[0-9]$/.test(e.key) &&
        ![
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
          'Delete',
          'Tab',
          'Backspace',
          'Enter'
        ].includes(e.key)
      ) {
        e.preventDefault()
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        let newDate = { ...date }

        if (field === 'day') {
          if (date[field] === new Date(date.year, date.month, 0).getDate()) {
            newDate = { ...newDate, day: 1, month: (date.month % 12) + 1 }
            if (newDate.month === 1) newDate.year += 1
          } else {
            newDate.day += 1
          }
        }

        if (field === 'month') {
          if (date[field] === 12) {
            newDate = { ...newDate, month: 1, year: date.year + 1 }
          } else {
            newDate.month += 1
          }
        }

        if (field === 'year') {
          newDate.year += 1
        }

        setDate(newDate)
        onChange(new Date(newDate.year, newDate.month - 1, newDate.day))
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        let newDate = { ...date }

        if (field === 'day') {
          if (date[field] === 1) {
            newDate.month -= 1
            if (newDate.month === 0) {
              newDate.month = 12
              newDate.year -= 1
            }
            newDate.day = new Date(newDate.year, newDate.month, 0).getDate()
          } else {
            newDate.day -= 1
          }
        }

        if (field === 'month') {
          if (date[field] === 1) {
            newDate = { ...newDate, month: 12, year: date.year - 1 }
          } else {
            newDate.month -= 1
          }
        }

        if (field === 'year') {
          newDate.year -= 1
        }

        setDate(newDate)
        onChange(new Date(newDate.year, newDate.month - 1, newDate.day))
      }

      if (e.key === 'ArrowRight') {
        if (
          e.currentTarget.selectionStart === e.currentTarget.value.length ||
          (e.currentTarget.selectionStart === 0 &&
            e.currentTarget.selectionEnd === e.currentTarget.value.length)
        ) {
          e.preventDefault()
          if (isDayFirst) {
            if (field === 'day') monthRef.current?.focus()
            if (field === 'month') yearRef.current?.focus()
          } else {
            if (field === 'month') dayRef.current?.focus()
            if (field === 'day') yearRef.current?.focus()
          }
        }
      } else if (e.key === 'ArrowLeft') {
        if (
          e.currentTarget.selectionStart === 0 ||
          (e.currentTarget.selectionStart === 0 &&
            e.currentTarget.selectionEnd === e.currentTarget.value.length)
        ) {
          e.preventDefault()
          if (isDayFirst) {
            if (field === 'month') dayRef.current?.focus()
            if (field === 'year') monthRef.current?.focus()
          } else {
            if (field === 'day') monthRef.current?.focus()
            if (field === 'year') dayRef.current?.focus()
          }
        }
      }
    }

  const dayInput = (
    <input
      type="text"
      ref={dayRef}
      max={31}
      maxLength={2}
      value={date.day.toString()}
      onChange={handleInputChange('day')}
      onKeyDown={handleKeyDown('day')}
      onFocus={(e) => {
        if (window.innerWidth > 1024) {
          e.target.select()
        }
      }}
      onBlur={handleBlur('day')}
      className="p-0 outline-none w-7 border-none text-center bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
      placeholder="D"
    />
  )

  const monthInput = (
    <input
      type="text"
      ref={monthRef}
      max={12}
      maxLength={2}
      value={date.month.toString()}
      onChange={handleInputChange('month')}
      onKeyDown={handleKeyDown('month')}
      onFocus={(e) => {
        if (window.innerWidth > 1024) {
          e.target.select()
        }
      }}
      onBlur={handleBlur('month')}
      className="p-0 outline-none w-6 border-none text-center bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
      placeholder="M"
    />
  )

  const yearInput = (
    <input
      type="text"
      ref={yearRef}
      max={9999}
      maxLength={4}
      value={date.year.toString()}
      onChange={handleInputChange('year')}
      onKeyDown={handleKeyDown('year')}
      onFocus={(e) => {
        if (window.innerWidth > 1024) {
          e.target.select()
        }
      }}
      onBlur={handleBlur('year')}
      className="p-0 outline-none w-12 border-none text-center bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
      placeholder="YYYY"
    />
  )

  return (
    <div className="flex border-2 border-border bg-card/50 text-foreground rounded-lg items-center text-sm px-2 py-1 shadow-sm hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-colors">
      {isDayFirst
        ? (
            <>
              {dayInput}
              <span className="text-muted-foreground/70 text-xs font-medium -mx-px">/</span>
              {monthInput}
              <span className="text-muted-foreground/70 text-xs font-medium -mx-px">/</span>
              {yearInput}
            </>
          )
        : (
            <>
              {monthInput}
              <span className="text-muted-foreground/70 text-xs font-medium -mx-px">/</span>
              {dayInput}
              <span className="text-muted-foreground/70 text-xs font-medium -mx-px">/</span>
              {yearInput}
            </>
          )}
    </div>
  )
}

DateInput.displayName = 'DateInput'

export { DateInput }
