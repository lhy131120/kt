import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";


const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      <p>Dashboard</p>
    </>
  )
}

export default Dashboard;