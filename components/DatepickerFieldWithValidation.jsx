import React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { Controller } from "react-hook-form";

export default function DatepickerFieldWithValidation({
  label,
  value,
  onChange,
  error,
  helperText,
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
      <DesktopDatePicker
        leftArrowButtonText="Mês anterior"
        rightArrowButtonText="Próximo mês"
        label={label}
        value={value}
        onChange={onChange}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            size="small"
            autoComplete="off"
            error={Boolean(error)}
            helperText={error ? error.message : helperText}
          />
        )}
        disableHighlightToday
      />
    </LocalizationProvider>
  );
}
