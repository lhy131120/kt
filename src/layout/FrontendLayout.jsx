import { Outlet, NavLink } from "react-router";

const FrontLayout = () => {
  return (
    <>
      {/* <header>Header</header> */}
      <main>
        <Outlet />
      </main>
      {/* <footer>footer</footer> */}
    </>
  )
}

export default FrontLayout;