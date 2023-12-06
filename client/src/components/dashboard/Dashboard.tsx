import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Admin from "./Admin";
import Employee from "./Employee";
import Manager from "./Manager";

export default function Dashboard() {
  const role = useSelector((state: RootState) => state.auth.user?.role);

  const Dashboard: { [key: string]: JSX.Element } = {
    "Super Admin": <Admin />,
    Employee: <Employee />,
    "Payroll Manager": <Manager />,
  };

  return Dashboard[role!];
}
