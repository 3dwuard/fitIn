import { Outlet } from "react-router-dom";
import { SessionProvider } from "./context/SessionContext";
import Navbar from "./components/Navbar";
import FooterNav from "./components/FooterNav";

const Providers = () => {
  return (
    <SessionProvider>
      <Navbar />
      <Outlet />
      <FooterNav />
    </SessionProvider>
  );
};

export default Providers;