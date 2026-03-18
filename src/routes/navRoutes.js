/**
 * Nav Menu 設定
 * 可自由新增、刪除、調整順序
 * 
 * 欄位說明：
 * - path: 路由路徑
 * - title: 顯示名稱
 * - children: 下拉子選單（選填）
 */
const navRoutes = [
  {
    path: '/about',
    title: '關於我們',
  },
  {
    path: '/products',
    title: '商品列表',
    children: [
      { path: '/products?category=1', title: '鍋具' },
      { path: '/products?category=2', title: '刀具' },
      { path: '/products?category=3', title: '餐具' },
    ],
  },
  {
    path: '/articles',
    title: '品牌專欄',
    children: [
      { path: '/articles?category=1', title: '最新消息' },
      { path: '/articles?category=2', title: '活動公告' },
      { path: '/articles?category=3', title: '品牌故事' },
    ],
  },
];

export default navRoutes;
