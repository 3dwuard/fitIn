import { Outlet } from "react-router-dom";
import NotFoundPage from "../Pages/404Page"
import { useSession } from "../context/SessionContext";
import { Navigate} from "react-router-dom";

const AuthProtectedRoute = () => {
  const { session } = useSession();
  if (!session) {
    return <Navigate to="/auth/sign-in"/>
  }
  return <Outlet />;
};

export default AuthProtectedRoute;