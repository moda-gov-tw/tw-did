import { useEffect, useState } from 'react';
import styles from './input.module.scss';

export const Input = ({
  initialValue,
  placeholder,
  commitValue,
  props,
}: {
  initialValue?: string;
  placeholder?: string;
  commitValue: (v: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: any;
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => setValue(initialValue), [initialValue]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleChange(e: any) {
    setValue(e.target.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function commitChange(e: any) {
    commitValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange,
    onBlur: commitChange,
    placeholder: placeholder,
    className: styles.Input,
  };

  return <input {...inputProps} />;
};
