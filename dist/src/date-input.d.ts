import React from 'react';
interface DateInputProps {
    value?: Date;
    onChange: (date: Date) => void;
}
declare const DateInput: React.FC<DateInputProps>;
export { DateInput };
