import { useState, useEffect, useMemo } from "react";

//Third party libraries
import moment from "moment";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { NumericFormat } from "react-number-format";
import InputMask from "react-input-mask";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import Link from "next/link";

//Mui components
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

//Custom components
import ContentWrapper from "@/components/templates/ContentWrapper";
import CustomTextField from "@/components/CustomTextField";
import DatepickerFieldWithValidation from "@/components/DatepickerFieldWithValidation";
import BackdropLoadingScreen from "@/components/BackdropLoadingScreen";
import GridGraph from "@/components/GridGraphWrapper";
import NoDataForShow from "@/components/NoDataForShow";

//Dashboards
import DashStatusEmprestimosAcordos from "@/components/dashboards/emprestimos/DashStatusEmprestimosAcordos";

//Utils
import { formatarReal } from "@/helpers/utils";

export default function DashboardEmprestimos() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user.token) {
      list();
    }
  }, [session?.user]);

  //States de controle de UI
  const [loading, setLoading] = useState(false);
  const [dataset, setDataset] = useState({
    indicadores: {
      emprestimos: {
        total: 0,
        andamento: 0,
        acordo: 0,
        quitado: 0,
        parcelas_pagas: 0,
        parcelas_nao_pagas: 0,
        vl_capital_giro: 0,
        vl_capital_giro_corrente: 0,
        vl_emprestimo: 0,
        vl_juros: 0,
      },
      acordos: {
        total: 0,
        andamento: 0,
        quitado: 0,
        vl_capital_giro_corrente: 0,
        vl_emprestimo: 0,
        vl_juros_adicional: 0,
        parcelas_pagas: 0,
        parcelas_nao_pagas: 0,
      },
    },
  });

  async function list() {
    setLoading(true);
    try {
      const response = await fetch(`/api/dashboards/emprestimos`, {
        method: "GET",
        headers: {
          Authorization: session?.user?.token,
        },
      });

      if (response.ok) {
        const json = await response.json();
        setDataset(json);
      } else {
        toast.error("Sem dados encontrados");
        setDataset({
          emprestimos: {
            total: 0,
            andamento: 0,
            acordo: 0,
            quitado: 0,
            parcelas_pagas: 0,
            parcelas_nao_pagas: 0,
            vl_capital_giro: 0,
            vl_capital_giro_corrente: 0,
            vl_emprestimo: 0,
            vl_juros: 0,
          },
          acordos: {
            total: 0,
            andamento: 0,
            quitado: 0,
            vl_capital_giro_corrente: 0,
            vl_emprestimo: 0,
            vl_juros_adicional: 0,
            parcelas_pagas: 0,
            parcelas_nao_pagas: 0,
          },
        });
      }
    } catch (error) {
      console.error("Erro ao obter dados", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  const dataStatusEmprestimos = [
    {
      id: 1,
      name: "Quantidade total de empréstimos ativos",
      qtd: dataset?.indicadores?.emprestimos?.andamento,
    },
    {
      id: 2,
      name: "Quantidade total de empréstimos quitados",
      qtd: dataset?.indicadores?.emprestimos?.quitado,
    },
  ];

  const dataStatusAcordos = [
    {
      id: 1,
      name: "Quantidade total de acordos ativos",
      qtd: dataset?.indicadores?.acordos?.andamento,
    },
    {
      id: 2,
      name: "Quantidade total de acordos quitados",
      qtd: dataset?.indicadores?.acordos?.quitado,
    },
  ];

  return (
    <ContentWrapper>
      <Toaster position="bottom-center" reverseOrder={true} />

      <Box sx={{ borderBottom: "2px solid #e9e9e9", width: "100%" }}>
        <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
          INFORMAÇÕES SOBRE EMPRÉSTIMOS
        </Typography>
      </Box>

      <Grid container spacing={1} sx={{ mt: 2, mb: 2 }}>
        <GridGraph xs={12} sm={12} md={4} lg={6} xl={6} size={100}>
          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
            Qtd. total empréstimos
          </Typography>
          <Typography sx={{ fontSize: 16 }}>
            {dataset?.indicadores?.emprestimos?.total}
          </Typography>
        </GridGraph>

        <GridGraph xs={12} sm={12} md={4} lg={6} xl={6} size={100}>
          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
            Capital de giro corrente
          </Typography>
          <Typography sx={{ fontSize: 16 }}>
            {formatarReal(
              dataset?.indicadores?.emprestimos?.vl_capital_giro_corrente
            )}
          </Typography>
        </GridGraph>

        <GridGraph
          title="Quantidade total de empréstimos"
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          // size={100}
        >
          <DashStatusEmprestimosAcordos data={dataStatusEmprestimos} label />
        </GridGraph>
      </Grid>

      <Box sx={{ borderBottom: "2px solid #e9e9e9", width: "100%" }}>
        <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
          INFORMAÇÕES SOBRE ACORDOS
        </Typography>
      </Box>

      <Grid container spacing={1} sx={{ mt: 2, mb: 2 }}>
        <GridGraph xs={12} sm={12} md={6} lg={6} xl={6} size={100}>
          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
            Qtd. total acordos
          </Typography>
          <Typography sx={{ fontSize: 16 }}>
            {dataset?.indicadores?.acordos?.total}
          </Typography>
        </GridGraph>

        <GridGraph xs={12} sm={12} md={6} lg={6} xl={6} size={100}>
          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
            Capital de giro corrente
          </Typography>
          <Typography sx={{ fontSize: 16 }}>
            {formatarReal(
              dataset?.indicadores?.acordos?.vl_capital_giro_corrente
            )}
          </Typography>
        </GridGraph>

        <GridGraph
          title="Quantidade total de acordos"
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
        >
          <DashStatusEmprestimosAcordos data={dataStatusAcordos} label />
        </GridGraph>
      </Grid>
    </ContentWrapper>
  );
}
