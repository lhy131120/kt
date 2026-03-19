import { Outlet } from "react-router";

const BackendLayout = () => {
  return (
    <div className="admin-layout">
      <main className="container">
        <Outlet />
      </main>
      <footer>
        <div className="container">
          <p>🛠️ 後台管理系統 | © 2026 小廚旅人 把世界帶回你的餐桌</p>
        </div>
      </footer>
    </div>
  )
}

export default BackendLayout;