import React, { forwardRef } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import {
  useController,
  FieldValues,
  Path,
  PathValue,
  useFormContext,
} from "react-hook-form";

type CustomFormTextFieldProps<TFieldValues extends FieldValues = FieldValues> =
  {
    name: Path<TFieldValues>;
    control?: any;
    defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>;
    label?: string;
    id?: string;
    errorMessage?: string;
  } & Omit<TextFieldProps, "name" | "defaultValue" | "ref">;

export const CustomFormTextField = forwardRef(function CustomFormTextField<
  TFieldValues extends FieldValues = FieldValues
>(
  {
    name,
    control,
    defaultValue,
    label,
    id,
    errorMessage,
    ...textFieldProps
  }: CustomFormTextFieldProps<TFieldValues>,
  ref: React.Ref<HTMLInputElement>
) {
  const methods = useFormContext<TFieldValues>();
  const resolvedControl = control || methods.control;

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control: resolvedControl,
    defaultValue,
  });

  return (
    <TextField
      {...field}
      inputRef={ref}
      id={id || name}
      label={label}
      error={!!error}
      helperText={error?.message || errorMessage}
      fullWidth
      {...textFieldProps}
    />
  );
});
