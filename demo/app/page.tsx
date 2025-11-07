'use client'

import { useState } from 'react'
import { DateRangePicker } from '../components/date-range-picker'

export default function Home() {
  const [selectedRange, setSelectedRange] = useState<{
    range: { from: Date; to?: Date }
    rangeCompare?: { from: Date; to?: Date }
  } | null>(null)

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Date Range Picker Demo</h1>
          <p className="text-muted-foreground">
            Enhanced DateRangePicker component for shadcn with Portuguese localization
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Basic Example */}
          <div className="space-y-4 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold">Basic Usage</h2>
            <p className="text-sm text-muted-foreground">
              Simple date range picker with default settings
            </p>
            <DateRangePicker
              onUpdate={(values) => {
                setSelectedRange(values)
                console.log('Selected range:', values)
              }}
            />
            {selectedRange && (
              <div className="mt-4 p-4 bg-muted rounded-md text-sm">
                <p className="font-medium mb-2">Selected Range:</p>
                <p>
                  From: {selectedRange.range.from.toLocaleDateString()}
                  {selectedRange.range.to && (
                    <> - To: {selectedRange.range.to.toLocaleDateString()}</>
                  )}
                </p>
                {selectedRange.rangeCompare && (
                  <p className="mt-2">
                    Compare: {selectedRange.rangeCompare.from.toLocaleDateString()}
                    {selectedRange.rangeCompare.to && (
                      <> - {selectedRange.rangeCompare.to.toLocaleDateString()}</>
                    )}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Portuguese Localization */}
          <div className="space-y-4 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold">Portuguese (pt-BR)</h2>
            <p className="text-sm text-muted-foreground">
              DateRangePicker with Portuguese localization and DD/MM/YYYY format
            </p>
            <DateRangePicker
              locale="pt-BR"
              onUpdate={(values) => console.log('PT-BR range:', values)}
            />
          </div>

          {/* Presets on Left */}
          <div className="space-y-4 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold">Presets on Left</h2>
            <p className="text-sm text-muted-foreground">
              Preset buttons positioned on the left side
            </p>
            <DateRangePicker
              presetPosition="left"
              onUpdate={(values) => console.log('Left presets range:', values)}
            />
          </div>

          {/* No Presets */}
          <div className="space-y-4 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold">No Presets</h2>
            <p className="text-sm text-muted-foreground">
              DateRangePicker with preset buttons hidden
            </p>
            <DateRangePicker
              presetPosition="none"
              onUpdate={(values) => console.log('No presets range:', values)}
            />
          </div>

          {/* Without Compare */}
          <div className="space-y-4 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold">Without Compare</h2>
            <p className="text-sm text-muted-foreground">
              DateRangePicker with compare feature disabled
            </p>
            <DateRangePicker
              showCompare={false}
              onUpdate={(values) => console.log('No compare range:', values)}
            />
          </div>

          {/* Custom Translations */}
          <div className="space-y-4 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold">Custom Translations</h2>
            <p className="text-sm text-muted-foreground">
              DateRangePicker with custom translation overrides
            </p>
            <DateRangePicker
              translations={{
                presets: {
                  last7: 'Past Week',
                  last30: 'Past Month',
                  thisMonth: 'Current Month',
                  lastMonth: 'Previous Month',
                  yesterday: 'Yesterday',
                  today: 'Today',
                  last14: 'Last 14 Days',
                  thisWeek: 'This Week',
                  lastWeek: 'Last Week'
                },
                actions: {
                  update: 'Apply',
                  compare: 'Compare Period',
                  cancel: 'Close'
                },
                labels: {
                  selectPlaceholder: 'Choose preset...'
                }
              }}
              onUpdate={(values) => console.log('Custom translations range:', values)}
            />
          </div>
        </div>
      </div>
    </main>
  )
}

