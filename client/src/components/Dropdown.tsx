import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { InputLabel } from "@mui/material";

export type ItemProps = {
  value: string | number;
  label: string;
};

export default function Dropdown({
  title,
  label,
  options,
  initValue,
  onChange,
  fullWidth = true,
}: {
  title: string;
  label: string;
  initValue?: string | number;
  onChange?: (event: SelectChangeEvent) => void;
  options: Array<ItemProps>;
  fullWidth?: boolean;
}) {
  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel id={title}>{label}</InputLabel>
      <Select
        labelId={title}
        id={title}
        name={title}
        label={label}
        title={title}
        defaultValue={initValue?.toString() || ""}
        onChange={onChange}
      >
        {options.map((item, index) => {
          return (
            <MenuItem key={index} value={item.value}>
              {item.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
