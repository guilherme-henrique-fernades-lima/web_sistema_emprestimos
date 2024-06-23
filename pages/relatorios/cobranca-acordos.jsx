import { useEffect, useState } from "react";

//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import moment from "moment";
import { NumericFormat } from "react-number-format";

//Custom componentes
import ContentWrapper from "../../components/templates/ContentWrapper";
import DataTable from "@/components/Datatable";
import DatepickerField from "@/components/DatepickerField";
import DateRangePicker from "@/components/DateRangePicker";

//Mui components
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Skeleton from "@mui/material/Skeleton";

//Utils
import {
  formatarData,
  renderSituacaoParcela,
  formatarReal,
  formatarCPFSemAnonimidade,
  formatarTelefone,
  renderStatusPagamento,
} from "@/helpers/utils";

//Icons
import BeenhereRoundedIcon from "@mui/icons-material/BeenhereRounded";

var DATA_HOJE = new Date();
var DATA_HOJE_FORMATTED = moment(DATA_HOJE).format("YYYY-MM-DD");

export default function RelatorioCobrancaAcordo() {
  const { data: session } = useSession();

  const [dataSet, setDataset] = useState([]);
  const [dataInicio, setDataInicio] = useState(DATA_HOJE.setDate(1));
  const [dataFim, setDataFim] = useState(new Date());
  const [emprestimoData, setAcordoData] = useState({});

  //States de controle de UI
  const [loadingParcela, setLoadingParcela] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  //States de payload de form
  const [tipoPagamentoParcela, setTipoPagamentoParcela] = useState("");
  const [dadosParcela, setDadosParcela] = useState({});

  async function list() {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/relatorios/cobranca-acordos/?dt_inicio=${moment(
          dataInicio
        ).format("YYYY-MM-DD")}&dt_final=${moment(dataFim).format(
          "YYYY-MM-DD"
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
        setLoading(false);
      } else {
        setDataset([]);
      }
    } catch (error) {
      console.error("Erro ao obter dados", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function getAcordoData(id) {
    try {
      const response = await fetch(
        `/api/relatorios/get-emprestimo-data/?id=${id}`,
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setAcordoData(json);
      }
    } catch (error) {
      console.error("Erro ao obter dados", error);
    }
  }

  async function updateParcela() {
    setLoadingParcela(true);

    const payload = {
      id: dadosParcela.id,
      nr_parcela: dadosParcela.nr_parcela,
      dt_pagamento: DATA_HOJE_FORMATTED,
    };

    try {
      const response = await fetch(
        `/api/relatorios/cobranca-acordos/?id=${payload.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: session?.user?.token,
          },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        setLoadingParcela(false);
        list();
        handleClose();
        toast.success("Operação realizada com sucesso");
      }
    } catch (error) {
      console.error("Erro ao obter dados", error);
      setLoadingParcela(false);
      toast.success("Erro, tente novamente em instantes");
    }

    setTimeout(() => {
      setLoadingParcela(false);
    }, 2000);
  }

  function handleClose() {
    setOpenModal(false);
    setDadosParcela({});

    setTimeout(() => {
      setAcordoData({});
    }, 500);
  }

  const columns = [
    {
      field: "id",
      headerName: "AÇÃO",
      renderHeader: (params) => <strong>AÇÃO</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Stack direction="row">
            <Tooltip title="Ação" placement="top">
              <IconButton
                sx={{ ml: 1 }}
                onClick={() => {
                  setOpenModal(true);
                  setDadosParcela(params.row);
                  getAcordoData(params.row.emprestimo);
                }}
              >
                <BeenhereRoundedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  return (
    <ContentWrapper title="Cobrança das parcelas dos acordos">
      <Toaster position="bottom-center" reverseOrder={true} />

      <DateRangePicker
        dataInicio={dataInicio}
        setDataInicio={setDataInicio}
        dataFinal={dataFim}
        setDataFinal={setDataFim}
        handleSearch={list}
        loading={loading}
      />

      <Box sx={{ width: "100%" }}>
        <DataTable rows={dataSet} columns={columns} />
      </Box>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              maxWidth: 450,
              maxHeight: 700,
              //height: "100%",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 2,
              borderRadius: 1,
              overflowY: "auto",

              ["@media (max-width:1200px)"]: {
                width: "90%",
              },
            }}
          >
            <Typography sx={{ fontWeight: 900, mb: 1 }}>
              AÇÃO NA PARCELA
            </Typography>

            <Box
              sx={{
                width: "100%",
                //backgroundColor: "#e3e3e3",
                padding: 1,
                borderRadius: 1,
                border: "2px solid #e3e3e3",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  borderBottom: "1px solid #ccc",
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>CPF:</Typography>
                <Typography>
                  {emprestimoData?.cpf ? (
                    formatarCPFSemAnonimidade(emprestimoData?.cpf)
                  ) : (
                    <Skeleton variant="rectangular" width={100} height={16} />
                  )}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  borderBottom: "1px solid #ccc",
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>
                  Nome do cliente:
                </Typography>
                <Typography>
                  {emprestimoData?.nome ? (
                    emprestimoData?.nome
                  ) : (
                    <Skeleton variant="rectangular" width={100} height={16} />
                  )}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  borderBottom: "1px solid #ccc",
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>Telefone:</Typography>
                <Typography>
                  {emprestimoData?.telefone ? (
                    formatarTelefone(emprestimoData?.telefone)
                  ) : (
                    <Skeleton variant="rectangular" width={100} height={16} />
                  )}
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
                <Typography sx={{ fontWeight: 700 }}>
                  Data do empréstimo:
                </Typography>
                <Typography>
                  {emprestimoData?.dt_emprestimo ? (
                    formatarData(emprestimoData?.dt_emprestimo)
                  ) : (
                    <Skeleton variant="rectangular" width={100} height={16} />
                  )}
                </Typography>
              </Box>
            </Box>
            <Grid container rowSpacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <FormControl component="fieldset">
                  <RadioGroup
                    value={tipoPagamentoParcela}
                    onChange={(e) => {
                      if (
                        e.target.value == "juros" ||
                        e.target.value === "vlr_total"
                      ) {
                        setDtPrevPagamento(null);
                        setValorParcial("");
                      }
                      setTipoPagamentoParcela(e.target.value);
                    }}
                  >
                    <FormControlLabel
                      value="vlr_total"
                      control={<Radio />}
                      label="Valor total"
                    />
                    <FormControlLabel
                      value="juros"
                      control={<Radio />}
                      label="Somente juros"
                    />
                    <FormControlLabel
                      value="parcial"
                      control={<Radio />}
                      label="Valor parcial"
                    />
                  </RadioGroup>
                </FormControl>

                {tipoPagamentoParcela === "parcial" &&
                  !dadosParcela?.vl_parcial && (
                    <Grid item xs={12} sx={{ mt: 1 }}>
                      <NumericFormat
                        value={valorParcial}
                        customInput={TextField}
                        thousandSeparator="."
                        decimalSeparator=","
                        decimalScale={2}
                        fixedDecimalScale={true}
                        prefix="R$ "
                        onValueChange={(values) => {
                          setValorParcial(parseFloat(values.value));
                        }}
                        size="small"
                        label="Valor parcial"
                        placeholder="R$ 0,00"
                        InputLabelProps={{ shrink: true }}
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 16 }}
                      />
                    </Grid>
                  )}

                {tipoPagamentoParcela === "parcial" &&
                  !dadosParcela?.vl_parcial && (
                    <Grid item xs={12} sx={{ mt: 1 }}>
                      <DatepickerField
                        label="Data para o pagamento restante"
                        value={dtPrevPagamento}
                        onChange={setDtPrevPagamento}
                      />
                    </Grid>
                  )}

                {tipoPagamentoParcela != "juros" && (
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexDirection: "column",
                      mt: 1,
                      mb: 1,
                      padding: 2,
                      borderRadius: 1,
                      backgroundColor: "#e4e4e4",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Typography sx={{ fontSize: 16 }}>
                        Valor da parcela:
                      </Typography>
                      <Typography sx={{ fontWeight: 900, fontSize: 16 }}>
                        {dadosParcela?.vl_parcela
                          ? formatarReal(parseFloat(dadosParcela?.vl_parcela))
                          : "-"}
                      </Typography>
                    </Box>

                    {tipoPagamentoParcela == "parcial" && (
                      <Box
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          mt: "5px",
                        }}
                      >
                        <Typography sx={{ fontSize: 16 }}>
                          Valor pago parcial:
                        </Typography>

                        {tipoPagamentoParcela === "parcial" &&
                        dadosParcela?.vl_parcial ? (
                          <Typography sx={{ fontWeight: 900, fontSize: 16 }}>
                            {formatarReal(parseFloat(dadosParcela?.vl_parcial))}
                          </Typography>
                        ) : (
                          <Typography sx={{ fontWeight: 900, fontSize: 16 }}>
                            {tipoPagamentoParcela === "parcial"
                              ? valorParcial
                                ? formatarReal(parseFloat(valorParcial))
                                : formatarReal(0)
                              : formatarReal(
                                  parseFloat(dadosParcela?.vl_parcela)
                                )}
                          </Typography>
                        )}
                      </Box>
                    )}

                    {tipoPagamentoParcela == "parcial" && (
                      <Box
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          borderTop: "1px solid #a1a1a1",
                          width: "100%",
                          mt: 1,
                        }}
                      >
                        <Typography sx={{ fontSize: 16 }}>
                          Valor restante:
                        </Typography>
                        <Typography sx={{ fontWeight: 900, fontSize: 16 }}>
                          {dadosParcela?.vl_parcial
                            ? formatarReal(
                                parseFloat(dadosParcela?.vl_parcela) -
                                  parseFloat(dadosParcela?.vl_parcial)
                              )
                            : dadosParcela?.vl_parcela && valorParcial
                            ? formatarReal(
                                parseFloat(dadosParcela?.vl_parcela) -
                                  parseFloat(valorParcial)
                              )
                            : "-"}
                        </Typography>
                        {/* <Typography sx={{ fontWeight: 900, fontSize: 16 }}>
                          {dadosParcela?.vl_parcela && valorParcial
                            ? formatarReal(
                                parseFloat(dadosParcela?.vl_parcela) -
                                  parseFloat(valorParcial)
                              )
                            : "-"}
                        </Typography> */}
                      </Box>
                    )}
                  </Grid>
                )}
              </Grid>

              {valorParcial > dadosParcela?.vl_parcela && (
                <Typography
                  sx={{
                    color: "#d32f2f",
                    fontSize: "0.75rem",
                  }}
                >
                  O valor parcial não deve ser maior que o valor da parcela
                </Typography>
              )}

              <Grid item xs={12}>
                <Grid container columnSpacing={1}>
                  <Grid item xs={6}>
                    <Button
                      disableElevation
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={handleClose}
                    >
                      CANCELAR
                    </Button>
                  </Grid>

                  <Grid item xs={6}>
                    <LoadingButton
                      disabled={
                        !(tipoPagamentoParcela === "juros" ||
                        tipoPagamentoParcela === "vlr_total" ||
                        (tipoPagamentoParcela === "parcial" &&
                          valorParcial &&
                          valorParcial <= dadosParcela?.vl_parcela &&
                          dtPrevPagamento)
                          ? true
                          : false)
                      }
                      disableElevation
                      variant="contained"
                      fullWidth
                      loading={loadingParcela}
                      onClick={() => {
                        updateParcela();
                      }}
                    >
                      SALVAR
                    </LoadingButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Modal>
    </ContentWrapper>
  );
}