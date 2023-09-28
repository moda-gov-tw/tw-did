import { useEffect, useState } from "react";
import styles from './input.module.scss';

export const Input = ({ initialValue, placeholder, commitValue, props }:
    {
        initialValue?: string,
        placeholder?: string,
        commitValue: (v: string) => void,
        props?: any
    }) => {
    const [value, setValue] = useState(initialValue);

    useEffect(()=>setValue(initialValue), [initialValue])

    function handleChange(e: any) {
        setValue(e.target.value);
    }

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

    return <input {...inputProps}
    />;
}