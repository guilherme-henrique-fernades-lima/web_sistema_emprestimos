//Mui components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

//Icons
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";

export default function NoDataToShow() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <ReportGmailerrorredIcon sx={{ color: "#dbdbdb", fontSize: 160 }} />
      <Typography
        variant="span"
        sx={{
          fontFamily: "Lato, sans-serif",
          fontWeight: 300,
          color: "#696969",
        }}
      >
        Sem dados para exibir
      </Typography>
    </Box>
  );
}
