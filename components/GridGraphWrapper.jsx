import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

//Icons
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

export default function GridGraph({
  children,
  xs,
  sm,
  md,
  lg,
  xl,
  title,
  helperText,
  size,
}) {
  return (
    <Grid
      item
      xs={xs || 12}
      sm={sm || 12}
      md={md || 12}
      lg={lg || 12}
      xl={xl || 12}
      sx={{
        height: size || 360,
        width: "100%",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        flexDirection: "column",
        padding: 1,
      }}
    >
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flexDirection: "column",
          backgroundColor: "#f3f3f3",
          padding: 2,
          borderRadius: "4px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
          }}
        >
          {/* <LeaderboardIcon sx={{ mr: 1, color: "#292929", fontSize: 26 }} /> */}
          <Typography sx={{ fontWeight: "bold", color: "#292929" }}>
            {title ? title.toUpperCase() : ""}
          </Typography>
        </Box>

        {helperText && (
          <Typography
            sx={{ fontWeight: "regular", fontSize: 12, color: "#292929" }}
          >
            {helperText}
          </Typography>
        )}

        {title && (
          <Box sx={{ width: "100%", borderTop: "1px solid #cacaca" }} />
        )}

        {children}
      </Box>
    </Grid>
  );
}
