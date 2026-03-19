import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../store/authSlice";
import { Navigate, Outlet } from "react-router"

const RouteGuade = ({ type }) => {

  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  console.log(`type:`, type);
  // console.log(`state:`, state.auth);

  useEffect(() => {
    if (isAuthenticated === null) {
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthenticated]);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">檢查登入狀態中...</span>
        </div>
      </div>
    )
  }

  if (type === "auth" && isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

  if (type === "protected" && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default RouteGuade;