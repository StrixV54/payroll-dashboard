import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from "@mui/x-data-grid";
import { UserRoleLevel } from "../utils/constants";
import { UserInfoFirebase } from "../utils/interface";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { queryUserAPI } from "../firebase/api";
import EditIcon from "@mui/icons-material/Edit";
import { orderBy as orderByQuery } from "firebase/firestore";
import { Typography } from "@mui/material";

export default function UsersListAdmin() {
  const [usersInfo, setUsersInfo] = useState<UserInfoFirebase[] | []>();
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

  const rows = usersInfo
    ?.filter((item: UserInfoFirebase) => item.status === "new")
    .map((item, index) => {
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
    { field: "grade", headerName: "Grade", flex: 1 },
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
      ],
    },
  ];

  return isLoading ? (
    <div>Loading....</div>
  ) : (
    <>
      <Typography color={"primary"}>
        New Requested: Please fill details
      </Typography>
      {rows?.length === 0 ? (
        <div>No User</div>
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
      )}
      <Typography color={"primary"} mt={4}>
        {" "}
        All Users{" "}
      </Typography>
    </>
  );
}
