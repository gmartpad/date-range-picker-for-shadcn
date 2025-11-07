'use client'

import * as React from 'react'
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon } from '@radix-ui/react-icons'
import { DayFlag, DayPicker, DropdownProps, SelectionState, UI } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { buttonVariants } from './button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './select'

interface CalendarLocale {
  weekdayNames: string[]
  monthNames: string[]
}

const CALENDAR_LOCALES: Record<string, CalendarLocale> = {
  'en-US': {
    weekdayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  },
  'pt-BR': {
    weekdayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  }
}

const getCalendarLocale = (locale: string = 'en-US'): CalendarLocale => {
  return CALENDAR_LOCALES[locale] || CALENDAR_LOCALES['en-US']
}

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  customLocale?: string
}

function Calendar ({
  className,
  classNames,
  showOutsideDays = true,
  customLocale = 'en-US',
  ...restProps
}: CalendarProps): React.JSX.Element {
  const calendarLocale = getCalendarLocale(customLocale)
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-2 xl:p-3', className)}
      formatters={{
        // eslint-disable-next-line
        formatCaption: (date) => `${calendarLocale.monthNames[date.getMonth()]} ${date.getFullYear()}`,
        formatWeekdayName: (date, options) => {
          // In react-day-picker v9, formatWeekdayName receives the date and options
          // The date is the first visible day in that column
          // We need to map the date's day of week to the correct column index
          // Since weekStartsOn={0} (Sunday), we can use getDay() directly
          // But we need to ensure we're using the correct weekday for the column
          const dayOfWeek = date.getDay()
          // Map dayOfWeek (0=Sunday, 1=Monday, etc.) to our weekdayNames array
          return calendarLocale.weekdayNames[dayOfWeek].substring(0, 2)
        }
      }}
      weekStartsOn={0}
      classNames={{
        [UI.Months]: 'relative flex flex-col sm:flex-row gap-4',
        [UI.Month]: 'space-y-4',
        [UI.MonthCaption]: 'flex justify-center items-center h-10 relative',
        [UI.CaptionLabel]: 'text-sm font-medium',
        [UI.PreviousMonthButton]: cn(
          buttonVariants({ variant: 'outline' }),
          'absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        [UI.NextMonthButton]: cn(
          buttonVariants({ variant: 'outline' }),
          'absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        [UI.MonthGrid]: 'w-full border-collapse space-y-1',
        [UI.Weekdays]: 'flex',
        [UI.Weekday]: 'text-muted-foreground rounded-md w-7 xl:w-8 font-normal text-[0.8rem]',
        [UI.Week]: 'flex w-full mt-2',
        [UI.Day]: cn(
          'relative h-7 w-7 xl:h-8 xl:w-8 p-0 text-center text-sm',
          'focus-within:relative focus-within:z-20',
          '[&:has([aria-selected])]:bg-accent',
          'first:[&:has([aria-selected])]:rounded-l-md',
          'last:[&:has([aria-selected])]:rounded-r-md'
        ),
        [UI.DayButton]: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-7 w-7 xl:h-8 xl:w-8 p-0 font-normal aria-selected:opacity-100'
        ),
        [UI.Dropdowns]: 'flex items-center gap-1',
        [SelectionState.range_end]: 'day-range-end',
        [SelectionState.selected]: cn(
          'bg-primary text-primary-foreground',
          'hover:bg-primary hover:text-primary-foreground',
          'focus:bg-primary focus:text-primary-foreground'
        ),
        [SelectionState.range_middle]: cn(
          'aria-selected:bg-accent aria-selected:text-accent-foreground'
        ),
        [DayFlag.today]: 'bg-accent text-accent-foreground',
        [DayFlag.outside]: cn(
          'day-outside text-muted-foreground opacity-50',
          'aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
          'aria-selected:opacity-30'
        ),
        [DayFlag.disabled]: 'text-muted-foreground opacity-50',
        [DayFlag.hidden]: 'invisible',
        ...classNames
      }}
      components={{
        Chevron: ({ orientation = 'left' }) => {
          switch (orientation) {
            case 'left':
              return <ChevronLeftIcon className="h-4 w-4" />
            case 'right':
              return <ChevronRightIcon className="h-4 w-4" />
            case 'up':
              return <ChevronUpIcon className="h-4 w-4" />
            case 'down':
              return <ChevronDownIcon className="h-4 w-4" />
            default:
              return <ChevronLeftIcon className="h-4 w-4" />
          }
        },
        Dropdown: ({ value, onChange, ...props }: DropdownProps) => {
          const selected = props.options?.find((option) => option.value === value)
          const handleChange = (value: string) => {
            const changeEvent = {
              target: { value }
            } as React.ChangeEvent<HTMLSelectElement>
            onChange?.(changeEvent)
          }

          return (
            <Select value={value?.toString()} onValueChange={handleChange}>
              <SelectTrigger className="pr-1.5 focus:ring-0">
                <SelectValue>{selected?.label}</SelectValue>
              </SelectTrigger>
              <SelectContent position="popper">
                {props.options?.map((option, id: number) => (
                  <SelectItem key={`${option.value}-${id}`} value={option.value?.toString() ?? ''}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }
      }}
      {...restProps}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
