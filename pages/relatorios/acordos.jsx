import { useEffect, useState } from "react";

//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import moment from "moment";
// import { useRouter } from "next/router";
import Link from "next/link";

// Custom componentes
import ContentWrapper from "../../components/templates/ContentWrapper";
import DataTable from "@/components/Datatable";
import DateRangePicker from "@/components/DateRangePicker";

// Mui components
import Box from "@mui/material/Box";

// Mui components
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";

// Utils
import {
  formatarData,
  formatarCPFSemAnonimidade,
  formatarReal,
  formatarPorcentagem,
  renderStatusPagamento,
  formatarTelefone,
  getDiaDaCobranca,
  renderSituacaoParcela,
} from "@/helpers/utils";

//Icons
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

var DATA_HOJE = new Date();
var DATA_HOJE_FORMATTED = moment(DATA_HOJE).format("YYYY-MM-DD");

export default function RelatorioAcordos() {
  const { data: session } = useSession();

  const [dataSet, setDataset] = useState([]);

  const [parcelas, setParcelas] = useState([]);
  const [dataInicio, setDataInicio] = useState(DATA_HOJE.setDate(1));
  const [dataFim, setDataFim] = useState(new Date());
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [idAcordo, setIdAcordo] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dadosAcordo, setDadosAcordo] = useState({});

  async function list() {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/relatorios/acordos/?dt_inicio=${moment(dataInicio).format(
          "YYYY-MM-DD"
        )}&dt_final=${moment(dataFim).format("YYYY-MM-DD")}`,
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
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function getParcelasAcordo(id) {
    try {
      const response = await fetch(
        `/api/relatorios/parcelas-acordo/?id=${id}`,
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setParcelas(json);
      }
    } catch (error) {
      console.error("Erro ao obter dados", error);
    }
  }

  function actionsAfterDelete() {
    setOpenDialogDelete(false);
    list();
    setIdAcordo("");
  }

  function handleClose() {
    setOpenModal(false);
    setTimeout(() => {
      setDadosAcordo({});
      setParcelas([]);
    }, 500);
  }

  // id = models.BigAutoField(primary_key=True)
  // uuid = models.UUIDField(default=uuid.uuid4, editable=False)
  // cpf = models.CharField(max_length=11, null=True, blank=True)
  // nome = models.CharField(max_length=200, null=True, blank=True)
  // telefone = models.CharField(max_length=20, null=True, blank=True)
  // vl_emprestimo = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
  // vl_cobrado = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
  // dt_acordo = models.DateField(null=True, blank=True)
  // vl_parcela = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
  // observacoes = models.TextField(null=True, blank=True)
  // created_at = models.DateTimeField(auto_now_add=True)
  // updated_at = models.DateTimeField(auto_now=True)
  // emprestimo_referencia = models.IntegerField(blank=True, null=True)

  const columns = [
    {
      field: "id",
      headerName: "AÇÃO",
      renderHeader: (params) => <strong>AÇÃO</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      // renderCell: (params) => {
      //   return (
      //     <Stack direction="row">

      //       <Tooltip title="Deletar" placement="top">
      //         <IconButton
      //           color="error"
      //           onClick={() => {
      //             setIdAcordo(params.value);
      //             setOpenDialogDelete(true);
      //           }}
      //         >
      //           <DeleteForeverIcon />
      //         </IconButton>
      //       </Tooltip>

      //       <Tooltip title="Ver parcelas" placement="top">
      //         <IconButton
      //           sx={{ ml: 1 }}
      //           onClick={() => {
      //             setOpenModal(true);
      //             getParcelasAcordo(params.value);
      //             setDadosAcordo(params.row);
      //           }}
      //         >
      //           <ContentPasteSearchIcon />
      //         </IconButton>
      //       </Tooltip>
      //       {params.row.status == "acordo" ||
      //       params.row.status == "finalizado" ? (
      //         <IconButton sx={{ ml: 1 }} disabled>
      //           <GavelIcon />
      //         </IconButton>
      //       ) : (
      //         <Tooltip title="Criar acordo" placement="top">
      //           <Link
      //             href={`/cadastros/acordo/?id=${params.value}&nome=${params.row.nome}&cpf=${params.row.cpf}&telefone=${params.row.telefone}`}
      //           >
      //             <IconButton sx={{ ml: 1 }}>
      //               <GavelIcon />
      //             </IconButton>
      //           </Link>
      //         </Tooltip>
      //       )}
      //     </Stack>
      //   );
      // },
    },
    {
      field: "dt_emprestimo",
      headerName: "DATA DO EMPRÉSTIMO",
      renderHeader: (params) => <strong>DATA DO EMPRÉSTIMO</strong>,
      minWidth: 220,
      align: "center",
      headerAlign: "center",
      // renderCell: (params) => {
      //   if (params.value) {
      //     return formatarData(params.value);
      //   }
      // },
    },
  ];

  return (
    <ContentWrapper title="Relação de acordos">
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

      <DialogDeletarRegistro
        open={openDialogDelete}
        close={setOpenDialogDelete}
        id={idAcordo}
        token={session?.user.token}
        onFinishDelete={actionsAfterDelete}
      />
      {/* <ModalParcelasAcordo
        open={openModal}
        handleClose={handleClose}
        parcelas={parcelas}
        dadosAcordo={dadosAcordo}
      /> */}
    </ContentWrapper>
  );
}

function DialogDeletarRegistro({ open, close, id, token, onFinishDelete }) {
  const [loading, setLoading] = useState(false);

  async function destroy() {
    try {
      setLoading(true);
      const response = await fetch(`/api/relatorios/acordos/?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        toast.success("Excluído");
        onFinishDelete();
      }
    } catch (error) {
      console.error("Erro ao obter dados", error);
    }

    setLoading(false);
  }

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 700, mb: 1 }}>
        Deseja deletar o acordo?
      </DialogTitle>

      <DialogActions>
        <Button
          onClick={() => {
            close(false);
          }}
        >
          CANCELAR
        </Button>

        <LoadingButton
          onClick={destroy}
          color="error"
          variant="contained"
          disableElevation
          loading={loading}
        >
          EXCLUIR
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

// function ModalParcelasAcordo({ open, handleClose, parcelas, dadosAcordo }) {
//   return (
//     <Modal
//       aria-labelledby="transition-modal-title"
//       aria-describedby="transition-modal-description"
//       open={open}
//       onClose={handleClose}
//       closeAfterTransition
//       slots={{ backdrop: Backdrop }}
//       slotProps={{
//         backdrop: {
//           timeout: 500,
//         },
//       }}
//     >
//       <Fade in={open}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: "100%",
//             maxWidth: 1200,
//             maxHeight: 600,
//             //height: "100%",
//             bgcolor: "background.paper",
//             boxShadow: 24,
//             //p: 3,
//             //borderRadius: 2,
//             overflowY: "auto",

//             ["@media (max-width:1200px)"]: {
//               width: "90%",
//             },
//           }}
//         >
//           <TableContainer
//             component={Paper}
//             sx={{ borderRadius: 0 }}
//             //elevation={0}
//           >
//             <Table stickyHeader aria-label="sticky table">
//               <TableHead>
//                 <TableRow>
//                   {/* <TableCell
//                     align="center"
//                     sx={{
//                       backgroundColor: "#292929",
//                       color: "white",
//                       fontWeight: 700,
//                     }}
//                   >
//                     SEQ.
//                   </TableCell> */}
//                   <TableCell
//                     align="center"
//                     sx={{
//                       backgroundColor: "#292929",
//                       color: "white",
//                       fontWeight: 700,
//                     }}
//                   >
//                     N° PARCELA
//                   </TableCell>
//                   <TableCell
//                     align="center"
//                     sx={{
//                       backgroundColor: "#292929",
//                       color: "white",
//                       fontWeight: 700,
//                     }}
//                   >
//                     DT. VENCIMENTO
//                   </TableCell>
//                   <TableCell
//                     align="center"
//                     sx={{
//                       backgroundColor: "#292929",
//                       color: "white",
//                       fontWeight: 700,
//                     }}
//                   >
//                     VLR. PARCELA
//                   </TableCell>
//                   <TableCell
//                     align="center"
//                     sx={{
//                       backgroundColor: "#292929",
//                       color: "white",
//                       fontWeight: 700,
//                     }}
//                   >
//                     DT. PAGAMENTO
//                   </TableCell>
//                   <TableCell
//                     align="center"
//                     sx={{
//                       backgroundColor: "#292929",
//                       color: "white",
//                       fontWeight: 700,
//                     }}
//                   >
//                     STATUS DO PRAZO
//                   </TableCell>
//                   <TableCell
//                     align="center"
//                     sx={{
//                       backgroundColor: "#292929",
//                       color: "white",
//                       fontWeight: 700,
//                     }}
//                   >
//                     STATUS PAGAMENTO
//                   </TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {parcelas?.length > 1 ? (
//                   <>
//                     {parcelas?.map((parcela, index) => (
//                       <TableRow
//                         key={parcela.id}
//                         sx={{
//                           "&:last-child td, &:last-child th": { border: 0 },
//                         }}
//                       >
//                         {/* <TableCell align="center">{index + 1}</TableCell> */}
//                         <TableCell align="center">
//                           {parcela.nr_parcela}
//                         </TableCell>
//                         <TableCell align="center">
//                           {parcela.dt_vencimento &&
//                             formatarData(parcela.dt_vencimento)}
//                         </TableCell>
//                         <TableCell align="center">
//                           {parcela.vl_parcela &&
//                             formatarReal(parseFloat(parcela.vl_parcela))}
//                         </TableCell>
//                         <TableCell align="center">
//                           {parcela.dt_pagamento &&
//                             formatarData(parcela.dt_pagamento)}
//                         </TableCell>
//                         <TableCell align="center">
//                           {parcela.status_pagamento == "pago" ||
//                           parcela.status_pagamento == "pago_parcial" ? (
//                             <Typography
//                               sx={{
//                                 fontSize: 10,
//                                 fontWeight: 700,
//                                 display: "inline-block",
//                                 padding: "2px 4px",
//                                 color: "#fff",
//                                 backgroundColor: "#009d1a",
//                               }}
//                             >
//                               PAGO
//                             </Typography>
//                           ) : (
//                             <>
//                               {renderSituacaoParcela(
//                                 DATA_HOJE_FORMATTED,
//                                 parcela.dt_vencimento
//                               )}
//                             </>
//                           )}
//                         </TableCell>
//                         <TableCell align="center">
//                           {renderStatusPagamento(
//                             parcela.vl_parcial,
//                             parcela.dt_pagamento,
//                             parcela.tp_pagamento
//                           )}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </>
//                 ) : (
//                   <>
//                     {[1, 2, 3, 4, 5, 6].map((row) => (
//                       <TableRow
//                         key={row.name}
//                         sx={{
//                           "&:last-child td, &:last-child th": { border: 0 },
//                         }}
//                       >
//                         {/* <TableCell component="th" scope="row">
//                           <Skeleton
//                             variant="rectangular"
//                             width="100%"
//                             height={20}
//                           />
//                         </TableCell> */}
//                         <TableCell align="right">
//                           <Skeleton
//                             variant="rectangular"
//                             width="100%"
//                             height={20}
//                           />
//                         </TableCell>
//                         <TableCell align="right">
//                           <Skeleton
//                             variant="rectangular"
//                             width="100%"
//                             height={20}
//                           />
//                         </TableCell>
//                         <TableCell align="right">
//                           <Skeleton
//                             variant="rectangular"
//                             width="100%"
//                             height={20}
//                           />
//                         </TableCell>
//                         <TableCell align="right">
//                           <Skeleton
//                             variant="rectangular"
//                             width="100%"
//                             height={20}
//                           />
//                         </TableCell>
//                         <TableCell align="right">
//                           <Skeleton
//                             variant="rectangular"
//                             width="100%"
//                             height={20}
//                           />
//                         </TableCell>
//                         <TableCell align="right">
//                           <Skeleton
//                             variant="rectangular"
//                             width="100%"
//                             height={20}
//                           />
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           <Box
//             sx={{
//               padding: 2,

//               width: {
//                 xs: "100%",
//                 sm: "100%",
//                 md: "70%",
//                 lg: "60%",
//                 xl: "50%",
//               },
//             }}
//           >
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 width: "100%",
//                 borderBottom: "1px solid #ccc",
//               }}
//             >
//               <Typography sx={{ fontWeight: 700 }}>CPF:</Typography>
//               <Typography>
//                 {dadosAcordo?.cpf &&
//                   formatarCPFSemAnonimidade(dadosAcordo?.cpf)}
//               </Typography>
//             </Box>

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 width: "100%",
//                 borderBottom: "1px solid #ccc",
//               }}
//             >
//               <Typography sx={{ fontWeight: 700 }}>Nome do cliente:</Typography>
//               <Typography>{dadosAcordo?.nome}</Typography>
//             </Box>

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 width: "100%",
//                 borderBottom: "1px solid #ccc",
//               }}
//             >
//               <Typography sx={{ fontWeight: 700 }}>Telefone:</Typography>
//               <Typography>
//                 {dadosAcordo?.telefone
//                   ? formatarTelefone(dadosAcordo?.telefone)
//                   : "-"}
//               </Typography>
//             </Box>

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 width: "100%",
//                 borderBottom: "1px solid #ccc",
//               }}
//             >
//               <Typography sx={{ fontWeight: 700 }}>
//                 Valor do empréstimo:
//               </Typography>
//               <Typography>
//                 {dadosAcordo?.vl_emprestimo &&
//                   formatarReal(parseFloat(dadosAcordo?.vl_emprestimo))}
//               </Typography>
//             </Box>

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 width: "100%",
//                 borderBottom: "1px solid #ccc",
//               }}
//             >
//               <Typography sx={{ fontWeight: 700 }}>Qtd. parcelas:</Typography>
//               <Typography>{dadosAcordo?.qt_parcela}</Typography>
//             </Box>

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 width: "100%",
//                 borderBottom: "1px solid #ccc",
//               }}
//             >
//               <Typography sx={{ fontWeight: 700 }}>Valor parcela:</Typography>
//               <Typography>{dadosAcordo?.vl_parcela}</Typography>
//             </Box>

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 width: "100%",
//                 borderBottom: "1px solid #ccc",
//               }}
//             >
//               <Typography sx={{ fontWeight: 700 }}>
//                 Valor capital de giro:
//               </Typography>
//               <Typography>
//                 {dadosAcordo?.vl_capital_giro &&
//                   formatarReal(parseFloat(dadosAcordo?.vl_capital_giro))}
//               </Typography>
//             </Box>

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 width: "100%",
//                 borderBottom: "1px solid #ccc",
//               }}
//             >
//               <Typography sx={{ fontWeight: 700 }}>% de Juros:</Typography>
//               <Typography>
//                 {dadosAcordo?.perc_juros &&
//                   formatarPorcentagem(dadosAcordo?.perc_juros)}
//               </Typography>
//             </Box>

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 width: "100%",
//                 borderBottom: "1px solid #ccc",
//               }}
//             >
//               <Typography sx={{ fontWeight: 700 }}>Observações:</Typography>
//               <Typography>{dadosAcordo?.observacoes}</Typography>
//             </Box>

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 width: "100%",
//               }}
//             >
//               <Typography sx={{ fontWeight: 700 }}>
//                 Data do empréstimo:
//               </Typography>
//               <Typography>
//                 {dadosAcordo?.dt_emprestimo &&
//                   formatarData(dadosAcordo?.dt_emprestimo)}
//               </Typography>
//             </Box>

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 width: "100%",
//               }}
//             >
//               <Typography sx={{ fontWeight: 700 }}>
//                 Dia escolhido para vencimento:
//               </Typography>
//               <Typography>
//                 {dadosAcordo?.dt_cobranca &&
//                   getDiaDaCobranca(dadosAcordo?.dt_cobranca)}
//               </Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Fade>
//     </Modal>
//   );
// }
