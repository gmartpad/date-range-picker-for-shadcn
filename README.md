# `@woli/date-range-picker` 

Enhanced DateRangePicker component built for [Shadcn](https://ui.shadcn.com/) using [Radix UI](https://www.radix-ui.com/) and [Tailwind CSS](https://tailwindcss.com/). 

## ✨ Enhanced Features

- **🌍 Portuguese Localization**: Complete pt-BR translation support
- **📅 DD/MM/YYYY Format**: Automatic date format based on locale
- **🎨 Improved Styling**: Better visual feedback and primary color integration
- **📍 Flexible Preset Positioning**: Configure presets on left, right, or hide them completely
- **🎯 Enhanced UX**: Improved switch visibility, hover states, and button styling

## Installation

Install via npm:

```bash
npm install @woli/date-range-picker
```

The `DateRangePicker` depends on the following components from shadcn:

- [Button](https://ui.shadcn.com/docs/components/button)
- [Calendar](https://ui.shadcn.com/docs/components/calendar)
- [Label](https://ui.shadcn.com/docs/components/label)
- [Popover](https://ui.shadcn.com/docs/components/popover)
- [Switch](https://ui.shadcn.com/docs/components/switch)

If you are using the CLI for installation, you can do this:

```
npx shadcn-ui@latest add button calendar label popover switch
```

The DateRangePicker uses [icons from Radix UI](https://icons.radix-ui.com/) so you will need to install that or update the component to use a different library.

```
npm install @radix-ui/react-icons
```

Next, copy and paste the code from the `/src` directory for [`DateInput`](https://github.com/johnpolacek/date-range-picker-for-shadcn/blob/main/src/date-input.tsx) and [`DateRangePicker`](https://github.com/johnpolacek/date-range-picker-for-shadcn/blob/main/src/date-range-picker.tsx) into your project and customize to your needs. The code is yours.


## Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `onUpdate` | function | - | Callback function that is called when the date range is updated. The function receives an object containing the selected date range and, if the compare feature is enabled, the compare date range. |
| `initialDateFrom` | Date or string | Today’s Date | The initial start date for the main date range. |
| `initialDateTo` | Date or string | - | The initial end date for the main date range. |
| `initialCompareFrom` | Date or string | - | The initial start date for the compare date range. |
| `initialCompareTo` | Date or string | - | The initial end date for the compare date range. |
| `align` | string | `'end'` | The alignment of the dropdown popover. Options are `'start'`, `'center'`, or `'end'`. |
| `locale` | string | `'en-US'` | The locale used for date formatting and UI text language. Supported locales: `'en-US'`, `'pt-BR'`. |
| `showCompare` | boolean | `true` | Whether to show the compare date range feature. |
| `presetPosition` | string | `'right'` | Position of preset buttons: `'left'`, `'right'`, or `'none'`. |
| `translations` | object | - | Custom translations to override default locale-based UI text. Allows partial overrides. |

## Examples

### Basic Usage

```jsx
import { DateRangePicker } from '@woli/date-range-picker'

<DateRangePicker
  onUpdate={(values) => console.log(values)}
  initialDateFrom="2023-01-01"
  initialDateTo="2023-12-31"
  align="start"
  locale="pt-BR"
  showCompare={false}
  presetPosition="left"
/>
```

### Enhanced Usage Examples

```jsx
// Portuguese localization with DD/MM/YYYY format
<DateRangePicker
  locale="pt-BR"
  onUpdate={(values) => console.log(values)}
/>

// Preset buttons on the left
<DateRangePicker
  presetPosition="left"
  onUpdate={(values) => console.log(values)}
/>

// Hide preset buttons entirely
<DateRangePicker
  presetPosition="none"
  onUpdate={(values) => console.log(values)}
/>
```

### Internationalization

The component supports automatic UI translation based on the `locale` prop:

```jsx
// Portuguese Brazilian UI
<DateRangePicker
  locale="pt-BR"
  onUpdate={(values) => console.log(values)}
/>
```

### Custom Translations

You can override specific UI text using the `translations` prop:

```jsx
// Portuguese with custom overrides
<DateRangePicker
  locale="pt-BR"
  translations={{
    presets: { today: 'Hoje mesmo' },
    actions: { update: 'Aplicar' }
  }}
  onUpdate={(values) => console.log(values)}
/>

// Custom English translations
<DateRangePicker
  translations={{
    presets: { 
      today: 'Right Now',
      last7: 'Past Week' 
    },
    actions: { 
      update: 'Apply Changes',
      cancel: 'Discard' 
    }
  }}
  onUpdate={(values) => console.log(values)}
/>
```

### Translation Object Structure

```typescript
interface TranslationObject {
  presets: {
    today: string
    yesterday: string
    last7: string
    last14: string
    last30: string
    thisWeek: string
    lastWeek: string
    thisMonth: string
    lastMonth: string
  }
  actions: {
    update: string
    compare: string
    cancel: string
  }
  labels: {
    selectPlaceholder: string
  }
}
```

