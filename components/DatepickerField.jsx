import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
// import moment from "moment";

// const today = new Date();

export default function DatepickerField({ label, value, onChange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
      <DesktopDatePicker
        leftArrowButtonText="Mês anterior"
        rightArrowButtonText="Próximo mês"
        label={label}
        onChange={(newValue) => {
          onChange(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} fullWidth size="small" autoComplete="off" />
        )}
        value={value}
        disableHighlightToday
      />
    </LocalizationProvider>
  );
}
