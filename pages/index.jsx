import { useSession } from "next-auth/react";

//Custom components
import ContentWrapper from "@/components/templates/ContentWrapper";

//mui components
import Typography from "@mui/material/Typography";

export default function Home() {
  const { data: session } = useSession();

  return (
    <ContentWrapper>
      {/* <Typography>
        Olá <strong>{session?.user?.username.toUpperCase()}</strong>, seja bem
        vindo ao sistema de gestão da <strong>Cédula Promotora</strong>
      </Typography> */}

      <Typography>Olá, seja bem vindo ao sistema!</Typography>
    </ContentWrapper>
  );
}
