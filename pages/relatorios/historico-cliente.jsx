import { useEffect, useState } from "react";

//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import moment from "moment";
import InputMask from "react-input-mask";

//Custom componentes
import ContentWrapper from "../../components/templates/ContentWrapper";
import DataTable from "@/components/Datatable";

//Mui components
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";

export default function RelatorioHistoricoCliente() {
  const { data: session } = useSession();

  const [cpfSearch, setCpfSearch] = useState("");
  const [loading, setLoading] = useState("");
  const [dataset, setDataset] = useState([]);

  async function searchClienteHistory(cpfToSeach) {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/relatorios/historico-cliente/?cpf=${cpfToSeach.replace(
          /\D/g,
          ""
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setDataset(json);
      } else {
        setDataset([]);
      }
    } catch (error) {
      console.error("Erro ao obter dados", error);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    {
      field: "id",
      headerName: "ID EMPRÉSTIMO",
      renderHeader: (params) => <strong>ID EMPRÉSTIMO</strong>,
      minWidth: 350,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <ContentWrapper title="Histórico de cliente">
      <Toaster position="bottom-center" reverseOrder={true} />

      <Grid container spacing={1} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <InputMask
            mask="999.999.999-99"
            maskChar={null}
            value={cpfSearch}
            onChange={(e) => {
              setCpfSearch(e.target.value);
            }}
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                variant="outlined"
                size="small"
                fullWidth
                label="CPF"
                placeholder="000.000.000-000"
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
              />
            )}
          </InputMask>
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={2} xl={2}>
          <LoadingButton
            loading={loading}
            disableElevation
            variant="contained"
            fullWidth
            onClick={() => searchClienteHistory(cpfSearch)}
          >
            Pesquisar
          </LoadingButton>
        </Grid>
      </Grid>

      <Box sx={{ width: "100%" }}>
        <DataTable rows={dataset} columns={columns} />
      </Box>
    </ContentWrapper>
  );
}
