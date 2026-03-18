import { Outlet, NavLink } from "react-router";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

const FrontLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default FrontLayout;