import { useEffect, useState } from "react";
import { UserInfoFirebase } from "../utils/interface";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { queryUserAPI } from "../firebase/api";
import { orderBy as orderByQuery } from "firebase/firestore";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { UserRoleLevel } from "../utils/constants";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [usersInfo, setUsersInfo] = useState<UserInfoFirebase[] | []>();
  const uid = useSelector((state: RootState) => state.auth.user?.uid);
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    //Fetch user detail
    const fetch = async () => {
      const infoUser = await queryUserAPI(orderByQuery("displayName", "asc"));
      setUsersInfo(infoUser as UserInfoFirebase[]);
      setIsLoading(false);
    };
    fetch();
  }, []);

  const rows = usersInfo?.map((item, index) => {
    return { ...item, id: index };
  });

  const handleEditBtn = (props: GridRowParams<any>) => {
    const { uid, displayName } = props.row;
    navigate("/userdetails?name=" + displayName, {
      state: { uid, displayName },
    });
  };

  const columns: GridColDef[] = [
    {
      field: "displayName",
      headerName: "Full Name",
      flex: 1,
    },
    { field: "role", headerName: "Role", flex: 1 },
    { field: "lastLoginAt", headerName: "Last Login At", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "employeeId", headerName: "Employee ID", flex: 1 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      hideable: role === UserRoleLevel.EMPLOYEE,
      getActions: (props) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEditBtn(props)}
        />,
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" />,
      ],
    },
  ];

  // console.log(usersInfo);

  return isLoading ? (
    <div>Loading....</div>
  ) : (
    <DataGrid
      rows={rows as any[]}
      columns={columns}
      sx={{ border: "none" }}
      columnVisibilityModel={{
        actions: role !== UserRoleLevel.EMPLOYEE,
      }}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 25 },
        },
      }}
      pageSizeOptions={[25, 50]}
    />
  );
}
