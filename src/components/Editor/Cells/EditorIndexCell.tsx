function numToHex(n: number) {
  const hex = n.toString(16);
  return hex.padStart(2, "0");
}

interface IndexCellProps {
  index: number;
}

export function EditorIndexCell({ index }: IndexCellProps) {
  const hex = numToHex(index);

  return (
    <td className="editorCell index">
      <div className="editorCellContainer">{hex.toUpperCase()}</div>
    </td>
  );
}
