import React, { useState, useEffect } from "react";
import {
  DataGrid,
  ptBR,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter sx={{ ml: 2, mt: 1 }} />
    </GridToolbarContainer>
  );
}

export default function DataTable(props) {
  const [pageSize, setPageSize] = useState(25);
  const [rows, setRows] = useState(props.rows);
  const [filterModel, setFilterModel] = useState({ items: [] });

  useEffect(() => {
    // Resetar o filtro ao atualizar as linhas
    setFilterModel({ items: [] });
    setRows(props.rows);
  }, [props.rows]);

  return (
    <DataGrid
      //localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
      rows={props.rows}
      columns={props.columns}
      autoHeight={true}
      sx={{
        mb: 2,
        mt: 2,
      }}
      disableColumnMenu={true}
      disableSelectionOnClick={true}
      disableColumnResize={true}
      pageSize={pageSize}
      pageSizeOptions={[5, 10, 25, 50, 100]}
      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
      disableRowSelectionOnClick
      slots={{
        toolbar: CustomToolbar,
      }}
      filterModel={filterModel}
      onFilterModelChange={(model) => setFilterModel(model)}
    />
  );
}
