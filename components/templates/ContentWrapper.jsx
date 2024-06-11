//Mui components
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

export default function ContentWrapper(props) {
  const { children, title } = props;

  return (
    <Paper
      sx={{
        width: "100%",
        padding: "20px",
        boxShadow: "rgba(100, 100, 111, 0.3) 0px 7px 29px 0px",
        marginBottom: 1,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        flexDirection: "column",
      }}
      elevation={0}
    >
      <Typography
        component="h2"
        variant="h2"
        sx={{
          fontSize: { xs: 14, sm: 16, md: 16, lg: 18, xl: 20 },
          fontWeight: 700,
          color: "#292929",
        }}
      >
        {title}
      </Typography>

      {title && <Divider sx={{ width: "100%", mt: 1 }} />}

      {children}
    </Paper>
  );
}
