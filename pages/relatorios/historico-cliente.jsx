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
import Typography from "@mui/material/Typography";

//Utils
import {
  formatarData,
  formatarReal,
  formatarCPFSemAnonimidade,
  formatarTelefone,
  formatarPorcentagem,
} from "@/helpers/utils";

export default function RelatorioHistoricoCliente() {
  const { data: session } = useSession();

  const [cpfSearch, setCpfSearch] = useState("");
  const [loading, setLoading] = useState("");
  const [dataset, setDataset] = useState({ data: [] });

  async function searchClienteHistory(cpfToSeach) {
    console.log(cpfToSeach);
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

        if (json?.data.length == 0) {
          toast.error("Sem registros encontrados");
        }
      }
    } catch (error) {
      console.error("Erro ao obter dados", error);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    {
      field: "dt_emprestimo",
      headerName: "DATA DO EMPRÉSTIMO",
      renderHeader: (params) => <strong>DATA DO EMPRÉSTIMO</strong>,
      minWidth: 220,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarData(params.value);
        }
      },
    },
    {
      field: "dt_cobranca",
      headerName: "DATA DA COBRANÇA",
      renderHeader: (params) => <strong>DATA DA COBRANÇA</strong>,
      minWidth: 220,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarData(params.value);
        }
      },
    },

    {
      field: "cpf",
      headerName: "CPF",
      renderHeader: (params) => <strong>CPF</strong>,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarCPFSemAnonimidade(params.value);
        }
      },
    },
    {
      field: "nome",
      headerName: "NOME DO CLIENTE",
      renderHeader: (params) => <strong>NOME DO CLIENTE</strong>,
      minWidth: 220,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "telefone",
      headerName: "TELEFONE",
      renderHeader: (params) => <strong>TELEFONE</strong>,
      minWidth: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarTelefone(params.value);
        }
      },
    },
    {
      field: "vl_emprestimo",
      headerName: "VLR. EMPRÉSTIMO",
      renderHeader: (params) => <strong>VLR. EMPRÉSTIMO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarReal(parseFloat(params.value));
        }
      },
    },
    {
      field: "vl_capital_giro",
      headerName: "VLR. CAPITAL DE GIRO",
      renderHeader: (params) => <strong>VLR. CAPITAL DE GIRO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarReal(parseFloat(params.value));
        }
      },
    },
    {
      field: "perc_juros",
      headerName: "% DE JUROS TOTAL",
      renderHeader: (params) => <strong>% DE JUROS TOTAL</strong>,
      minWidth: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarPorcentagem(parseFloat(params.value));
        }
      },
    },
    {
      field: "perc_juros_a",
      headerName: "% DE JUROS A",
      renderHeader: (params) => <strong>% DE JUROS A</strong>,
      minWidth: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return formatarPorcentagem(parseFloat(params.row.perc_juros / 2));
      },
    },
    {
      field: "perc_juros_b",
      headerName: "% DE JUROS B",
      renderHeader: (params) => <strong>% DE JUROS B</strong>,
      minWidth: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return formatarPorcentagem(parseFloat(params.row.perc_juros / 2));
      },
    },
    {
      field: "status",
      headerName: "STATUS",
      renderHeader: (params) => <strong>STATUS</strong>,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return params.value.toUpperCase();
      },
    },
    {
      field: "qt_parcela",
      headerName: "QTD DE PARCELAS",
      renderHeader: (params) => <strong>QTD DE PARCELAS</strong>,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "parcelas_pagas",
      headerName: "QTD. PARC. PAGAS",
      renderHeader: (params) => <strong>QTD. PARC. PAGAS</strong>,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "parcelas_nao_pagas",
      headerName: "QTD. PARC. NÃO PAGAS",
      renderHeader: (params) => <strong>QTD. PARC. NÃO PAGAS</strong>,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "vl_parcela",
      headerName: "VLR. PARCELA",
      renderHeader: (params) => <strong>VLR. PARCELA</strong>,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarReal(parseFloat(params.value));
        }
      },
    },

    {
      field: "observacoes",
      headerName: "OBSERVAÇÕES",
      renderHeader: (params) => <strong>OBSERVAÇÕES</strong>,
      minWidth: 350,
      align: "left",
      headerAlign: "center",
    },
  ];

  function capitalizeFirstLetter(status) {
    if (!status) {
      return "";
    }
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

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
            disabled={cpfSearch.replace(/\D/g, "").length < 11 ? true : false}
          >
            Pesquisar
          </LoadingButton>
        </Grid>
      </Grid>

      {dataset?.data.length > 1 && (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexDirection: "column",
              backgroundColor: "#efefef",
              padding: 1,
              width: "100%",
              maxWidth: 400,
              borderRadius: 1,
              mt: 2,
            }}
          >
            {dataset?.dados_cliente[0] && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>Nome:</Typography>
                  <Typography>{dataset?.dados_cliente[0]?.nome}</Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>
                    Data de nascimento:
                  </Typography>
                  <Typography>
                    {dataset?.dados_cliente[0]?.dt_nascimento}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>Telefone:</Typography>
                  <Typography>{dataset?.dados_cliente[0]?.telefone}</Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>CEP:</Typography>
                  <Typography>{dataset?.dados_cliente[0]?.cep}</Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>Logradouro:</Typography>
                  <Typography>
                    {dataset?.dados_cliente[0]?.logradouro}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>Complemento:</Typography>
                  <Typography>
                    {dataset?.dados_cliente[0]?.complemento}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>Bairro:</Typography>
                  <Typography>{dataset?.dados_cliente[0]?.bairro}</Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>Cidade:</Typography>
                  <Typography>{dataset?.dados_cliente[0]?.cidade}</Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>UF:</Typography>
                  <Typography>{dataset?.dados_cliente[0]?.uf}</Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>
                    Está na blacklist?
                  </Typography>
                  <Typography>
                    {dataset?.dados_cliente[0]?.is_blacklisted ? "Sim" : "Não"}
                  </Typography>
                </Box>
              </>
            )}

            {dataset?.indicadores?.tt_emprestimos?.map((item) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>
                  Qtd de empréstimos em {item.status}
                </Typography>
                <Typography>{item.qtd}</Typography>
              </Box>
            ))}
          </Box>
        </>
      )}

      {dataset?.data.length > 1 && (
        <>
          <Box sx={{ width: "100%" }}>
            <DataTable rows={dataset?.data} columns={columns} />
          </Box>
        </>
      )}
    </ContentWrapper>
  );
}
