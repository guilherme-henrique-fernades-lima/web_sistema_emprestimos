import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { rotas } from "@/helpers/routes";

//Mui components
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

//Custom components
import ContentWrapper from "@/components/templates/ContentWrapper";

export function ProtectedRoute({ children, perms }) {
  const pathname = usePathname();
  const [allowPage, setAllowPage] = useState(null);

  useEffect(() => {
    if (pathname == "/") {
      setAllowPage(true);
    }

    if (perms && pathname && pathname != "/") {
      const isAllowed = perms[rotas[pathname]] ? true : false;
      setAllowPage(isAllowed);
    }
  }, [perms, pathname]);

  if (allowPage === null) {
    return (
      <ContentWrapper>
        <Stack
          sx={{
            width: "100%",
            height: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={80} />
        </Stack>
      </ContentWrapper>
    );
  }

  return allowPage ? <>{children}</> : <AcessoNaoPermitido />;
}

function AcessoNaoPermitido() {
  return (
    <ContentWrapper>
      <Stack sx={{ width: "100%" }} spacing={2}>
        <Alert severity="error">
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: 16, sm: 16, md: 18, lg: 20, xl: 22 },
              color: "#d80000",
            }}
          >
            Acesso não autorizado
          </Typography>
        </Alert>
      </Stack>
    </ContentWrapper>
  );
}
