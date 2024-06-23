import React from "react";

// Mui components
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import moment from "moment";

// Icons
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

export default function DateRangePicker({
  dataInicio,
  setDataInicio,
  dataFinal,
  setDataFinal,
  handleSearch,
  loading,
}) {
  return (
    <Grid container spacing={1} sx={{ mt: 1, mb: 2 }}>
      <Grid item xs={12} sm={6} md={3} lg={3} xl={2}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
          <DesktopDatePicker
            leftArrowButtonText="Mês anterior"
            rightArrowButtonText="Próximo mês"
            label="Início"
            onChange={(newValue) => {
              setDataInicio(newValue);
            }}
            value={dataInicio}
            renderInput={(params) => (
              <TextField {...params} fullWidth size="small" />
            )}
            disableHighlightToday
          />
        </LocalizationProvider>
      </Grid>

      <Grid item xs={12} sm={6} md={3} lg={3} xl={2}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
          <DesktopDatePicker
            leftArrowButtonText="Mês anterior"
            rightArrowButtonText="Próximo mês"
            label="Fim"
            onChange={(newValue) => {
              setDataFinal(newValue);
            }}
            value={dataFinal}
            renderInput={(params) => (
              <TextField {...params} fullWidth size="small" />
            )}
            disableHighlightToday
          />
        </LocalizationProvider>
      </Grid>

      <Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
        <LoadingButton
          variant="contained"
          disableElevation
          fullWidth
          loading={loading}
          endIcon={<SearchRoundedIcon />}
          onClick={handleSearch}
          sx={{ minHeight: "40px" }}
          disabled={dataInicio && dataFinal ? false : true}
        >
          PESQUISAR
        </LoadingButton>
      </Grid>
    </Grid>
  );
}
