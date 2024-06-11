import InputMask from "react-input-mask";
import { Controller } from "react-hook-form";

//Mui components
import TextField from "@mui/material/TextField";

export default function CustomTextField({
  value,
  setValue,
  label,
  helperText,
  placeholder,
  validateFieldName,
  maskFieldFlag,
  numbersNotAllowed,
  onlyNumbers,
  control,
  ...props
}) {
  const handleChange = (e) => {
    if (numbersNotAllowed) {
      setValue(e.target.value.replace(/[^A-Za-z\s]/g, ""));
    } else if (onlyNumbers) {
      setValue(e.target.value.replace(/[^0-9]/g, ""));
    } else {
      setValue(e.target.value);
    }
  };

  return control ? (
    <Controller
      name={validateFieldName}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          value={value}
          helperText={error ? error.message : helperText}
          onChange={(e) => {
            field.onChange(e);
            handleChange(e);
          }}
          size="small"
          label={label}
          placeholder={placeholder}
          InputLabelProps={{ shrink: true }}
          autoComplete="off"
          fullWidth
          error={Boolean(error)}
          {...props}
        />
      )}
    />
  ) : (
    <TextField
      value={value}
      helperText={helperText}
      onChange={handleChange}
      size="small"
      label={label}
      placeholder={placeholder}
      InputLabelProps={{ shrink: true }}
      autoComplete="off"
      fullWidth
      {...props}
    />
  );
}
