import styled from "@emotion/styled";
import { Typography } from "@mui/joy";
import React from "react";
import { TableCell } from "./StyledTableCell.tsx";

const StyledIndexCell = styled(TableCell)({
  letterSpacing: "initial",
  width: 30,
  padding: 0,
  fontWeight: "bold",
  borderRight: "1px solid black",
});

function numToHex(n: number) {
  const hex = n.toString(16);
  return hex.padStart(2, "0");
}

type IndexCellProps = {
  index: number;
};

export const IndexCell = React.memo(function IndexCell({ index }: IndexCellProps) {
  const hex = numToHex(index);

  return (
    <StyledIndexCell>
      <Typography level="body-xs">{hex.toUpperCase()}</Typography>
    </StyledIndexCell>
  );
});
