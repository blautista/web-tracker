import React from "react";
import { TableCell } from "./StyledTableCell.tsx";
import styled from "@emotion/styled";

const StyledIndexCell = styled(TableCell)({
  letterSpacing: "initial",
  width: 20,
  paddingLeft: 16,
  paddingRight: 16,
  fontWeight: "bold",
  borderRight: "1px solid lightgray",
});

export const IndexCell = React.memo(function IndexCell({ children }: { children: string }) {
  return <StyledIndexCell>{children}</StyledIndexCell>;
});
