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
import CustomTextField from "@/components/CustomTextField";
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

export default function RelatorioCobrancaEmprestimos() {
  const { data: session } = useSession();

  const [dataSet, setDataset] = useState([]);
  const [dataInicio, setDataInicio] = useState(DATA_HOJE.setDate(1));
  const [dataFim, setDataFim] = useState(new Date());
  const [emprestimoData, setEmprestimoData] = useState({});

  //States de controle de UI
  const [loadingParcela, setLoadingParcela] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  //States de payload de form
  const [tipoPagamentoParcela, setTipoPagamentoParcela] = useState("");
  const [valorParcial, setValorParcial] = useState("");
  const [dadosParcela, setDadosParcela] = useState({});
  const [dtPrevPagamento, setDtPrevPagamento] = useState(null);
  const [observacoes, setObservacoes] = useState("");

  const [statusParcelaSearch, setStatusParcelaSearch] = useState("pendentes");

  useEffect(() => {
    if (dadosParcela?.vl_parcial) {
      setTipoPagamentoParcela("parcial");
    }
  }, [dadosParcela]);

  async function list() {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/relatorios/cobranca-emprestimos/?dt_inicio=${moment(
          dataInicio
        ).format("YYYY-MM-DD")}&dt_final=${moment(dataFim).format(
          "YYYY-MM-DD"
        )}&tipo_parcela=${statusParcelaSearch}`,
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
        toast.error("Sem dados encontrados");
        setDataset([]);
      }
    } catch (error) {
      console.error("Erro ao obter dados", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function getEmprestimoData(id) {
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
        setEmprestimoData(json);
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
      tp_pagamento: tipoPagamentoParcela,
      vl_parcial: valorParcial ? valorParcial : null,
      dt_pagamento: DATA_HOJE_FORMATTED,
      emprestimo: dadosParcela?.emprestimo,
      dt_prev_pag_parcial_restante: dtPrevPagamento
        ? moment(dtPrevPagamento).format("YYYY-MM-DD")
        : null,
      observacoes: observacoes,
    };

    try {
      const response = await fetch(
        `/api/relatorios/cobranca-emprestimos/?id=${payload.id}`,
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
    setTipoPagamentoParcela("");
    setValorParcial("");
    setDadosParcela({});
    setDtPrevPagamento(null);
    setObservacoes("");

    setTimeout(() => {
      setEmprestimoData({});
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
        if (
          (params.row.tp_pagamento != "juros" &&
            params.row.tp_pagamento != "acordo" &&
            !params.row.dt_pagamento) ||
          params.row.vl_parcial
        ) {
          return (
            <Stack direction="row">
              <Tooltip title="Ação" placement="top">
                <IconButton
                  sx={{ ml: 1 }}
                  onClick={() => {
                    setOpenModal(true);
                    setDadosParcela(params.row);
                    getEmprestimoData(params.row.emprestimo);
                  }}
                >
                  <BeenhereRoundedIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        } else {
          return "";
        }
      },
    },
    // {
    //   field: "id_copy",
    //   headerName: "ID. DA PARCELA",
    //   renderHeader: (params) => <strong>ID. DA PARCELA</strong>,
    //   minWidth: 200,
    //   align: "center",
    //   headerAlign: "center",
    //   valueGetter: (params) => params.row.id,
    // },

    // {
    //   field: "emprestimo",
    //   headerName: "ID. DA EMPRÉSTIMO",
    //   renderHeader: (params) => <strong>ID. DA EMPRÉSTIMO</strong>,
    //   minWidth: 200,
    //   align: "center",
    //   headerAlign: "center",
    // },

    {
      field: "nr_parcela",
      headerName: "NR. PARCELA",
      renderHeader: (params) => <strong>NR. PARCELA</strong>,
      minWidth: 140,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => {
        if (params.value) {
          return `${params.value}/${params.row.qtd_tt_parcelas}`;
        }
      },
    },
    {
      field: "dt_vencimento_copy",
      headerName: "SITUAÇÃO DA PARCELA",
      renderHeader: (params) => <strong>SITUAÇÃO DA PARCELA</strong>,
      minWidth: 220,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.row.tp_pagamento == "acordo") {
          return (
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                display: "inline-block",
                padding: "2px 4px",
                color: "#fff",
                backgroundColor: "#292929",
              }}
            >
              ACORDO
            </Typography>
          );
        }
        if (!params.row.dt_pagamento) {
          return renderSituacaoParcela(
            DATA_HOJE_FORMATTED,
            params.row.dt_vencimento
          );
        }
      },
    },
    {
      field: "tp_pagamento",
      headerName: "TIPO PAGAMENTO",
      renderHeader: (params) => <strong>TIPO PAGAMENTO</strong>,
      minWidth: 220,
      flex: 1,
      align: "center",
      headerAlign: "center",

      renderCell: (params) => {
        if (params.row.tp_pagamento == "acordo") {
          return (
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                display: "inline-block",
                padding: "2px 4px",
                color: "#fff",
                backgroundColor: "#292929",
              }}
            >
              ACORDO
            </Typography>
          );
        }

        return renderStatusPagamento(
          params.row.vl_parcial,
          params.row.dt_pagamento,
          params.row.tp_pagamento
        );
      },
    },

    {
      field: "dt_vencimento",
      headerName: "DATA DO VENCIMENTO",
      renderHeader: (params) => <strong>DATA DO VENCIMENTO</strong>,
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
      field: "dt_pagamento",
      headerName: "DATA DO PAGAMENTO",
      renderHeader: (params) => <strong>DATA DO PAGAMENTO</strong>,
      minWidth: 220,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarData(params.value);
        }
      },
    },
    // {
    //   field: "__tp_pagamento",
    //   headerName: "TIPO PAGAMENTO",
    //   renderHeader: (params) => <strong>TIPO PAGAMENTO</strong>,
    //   minWidth: 220,
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    //   valueGetter: (params) => {
    //     return params.row.tp_pagamento;
    //   },
    // },
    {
      field: "dt_prev_pag_parcial_restante",
      headerName: "DATA PREV. PAG. RESTANTE",
      renderHeader: (params) => <strong>DATA PREV. PAG. RESTANTE</strong>,
      minWidth: 260,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarData(params.value);
        }
      },
    },
    {
      field: "vl_parcial",
      headerName: "VLR. PARCIAL",
      renderHeader: (params) => <strong>VLR. PARCIAL</strong>,
      minWidth: 200,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarReal(parseFloat(params.value));
        }
      },
    },
    {
      field: "_vl_parcial",
      headerName: "VLR. RESTANTE",
      renderHeader: (params) => <strong>VLR. RESTANTE</strong>,
      minWidth: 200,
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => {
        if (params.row.vl_parcial) {
          return formatarReal(
            parseFloat(params.row.vl_parcela - params.row.vl_parcial)
          );
        }
      },
    },
    {
      field: "observacoes",
      headerName: "OBSERVAÇÕES",
      renderHeader: (params) => <strong>OBSERVAÇÕES</strong>,
      minWidth: 350,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
  ];

  return (
    <ContentWrapper title="Cobrança das parcelas dos empréstimos">
      <Toaster position="bottom-center" reverseOrder={true} />

      <DateRangePicker
        dataInicio={dataInicio}
        setDataInicio={setDataInicio}
        dataFinal={dataFim}
        setDataFinal={setDataFim}
        handleSearch={list}
        loading={loading}
      />

      <FormControl component="fieldset">
        <FormLabel id="demo-radio-buttons-group-label">
          Filtrar parcelas:
        </FormLabel>
        <RadioGroup
          row
          value={statusParcelaSearch}
          onChange={(e) => {
            setStatusParcelaSearch(e.target.value);
          }}
        >
          <FormControlLabel
            value="pendentes"
            control={<Radio />}
            label="Pendentes/Pago parcial"
          />
          <FormControlLabel
            value="pagos"
            control={<Radio />}
            label="Já pagas"
          />
          <FormControlLabel
            value="pago_parcial"
            control={<Radio />}
            label="Pagas parcialmente"
          />
          <FormControlLabel
            value="juros"
            control={<Radio />}
            label="Só juros"
          />
          <FormControlLabel
            value="todos"
            control={<Radio />}
            label="Todas as parcelas"
          />
        </RadioGroup>
      </FormControl>

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
                        setObservacoes("");
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

                {tipoPagamentoParcela === "parcial" &&
                  !dadosParcela?.vl_parcial && (
                    <Grid item xs={12} sx={{ mt: 1 }}>
                      <TextField
                        multiline
                        rows={3}
                        size="small"
                        label="Observações sobre a parcela"
                        value={observacoes}
                        onChange={(e) => {
                          setObservacoes(e.target.value);
                        }}
                        placeholder="Insira observações se necessário..."
                        InputLabelProps={{ shrink: true }}
                        autoComplete="off"
                        fullWidth
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
                        (observacoes &&
                          tipoPagamentoParcela === "parcial" &&
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
