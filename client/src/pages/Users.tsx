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
import EditIcon from "@mui/icons-material/Edit";
import { UserRoleLevel } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import UsersListAdmin from "../components/UsersListAdmin";

export default function Users() {
  const [usersInfo, setUsersInfo] = useState<UserInfoFirebase[] | []>();
  const uid = useSelector((state: RootState) => state.auth.user?.uid);
  const role =
    useSelector((state: RootState) => state.auth.user?.role) || "Employee";
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

  const rows = usersInfo
    ?.filter(
      (item: UserInfoFirebase) =>
        item.role !== UserRoleLevel.SUPER_ADMIN && item.status === "Active"
    )
    .map((item, index) => {
      return { ...item, id: index };
    });

  const handleEditBtn = (props: GridRowParams<any>) => {
    const { uid, displayName } = props.row;
    navigate("/userdetails?name=" + displayName, {
      state: { uid, displayName },
    });
  };

  const ColumnsAccessSpecific: { [key: string]: any } = {
    Employee: [
      { field: "displayName", headerName: "Full Name", flex: 1 },
      { field: "role", headerName: "Role", flex: 1 },
      { field: "grade", headerName: "Grade", flex: 1 },
      { field: "email", headerName: "Email", width: 200 },
      { field: "employeeId", headerName: "Employee ID", flex: 1 },
    ],
    "Payroll Manager": [
      { field: "displayName", headerName: "Full Name", flex: 1 },
      { field: "role", headerName: "Role", flex: 1 },
      { field: "grade", headerName: "Grade", flex: 1 },
      { field: "lastLoginAt", headerName: "Last Login At", width: 200 },
      { field: "email", headerName: "Email", width: 200 },
      { field: "employeeId", headerName: "Employee ID", flex: 1 },
    ],
    "Super Admin": [
      { field: "displayName", headerName: "Full Name", flex: 1 },
      { field: "role", headerName: "Role", flex: 1 },
      { field: "grade", headerName: "Grade", flex: 1 },
      {
        field: "lastLoginAt",
        headerName: "Last Login At",
        width: 200,
      },
      { field: "email", headerName: "Email", width: 200 },
      { field: "status", headerName: "Status", flex: 1 },
      { field: "employeeId", headerName: "Employee ID", flex: 1 },
    ],
  };

  const columns: GridColDef[] = [
    ...ColumnsAccessSpecific[role],
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
      ],
    },
  ];

  // console.log(usersInfo);

  return isLoading ? (
    <div>Loading....</div>
  ) : (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {role === UserRoleLevel.SUPER_ADMIN && <UsersListAdmin />}
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
        disableRowSelectionOnClick
      />
    </Box>
  );
}
