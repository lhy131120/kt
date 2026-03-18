# Loading 機制完整執行流程

## 一、整體架構總覽

Loading 機制分為 **三層**，透過「橋接模式」把 React 狀態與 Axios 攔截器串起來：

```
┌─────────────────────────────────────────────────────────┐
│  React 層（Context + State）                             │
│  LoadingProvider → isLoading / showLoading / hideLoading │
└──────────────┬──────────────────────────────────────────┘
               │ 透過 LoadingInitializer 橋接
               ▼
┌─────────────────────────────────────────────────────────┐
│  橋接層（模組變數）                                       │
│  axiosInstance.js 的 loadingController                   │
└──────────────┬──────────────────────────────────────────┘
               │ 在 interceptor 中自動呼叫
               ▼
┌─────────────────────────────────────────────────────────┐
│  API 層（Axios Interceptor）                             │
│  requestInterceptor / responseHandler                   │
└─────────────────────────────────────────────────────────┘
```

---

## 二、元件樹結構（App.jsx）

```jsx
<LoadingProvider>          // ① 提供 isLoading 狀態 + 控制函式
  <LoadingInitializer>     // ② 把 React 函式注入到 axios 模組變數
    <Loading />            // ③ 根據 isLoading 決定顯示/隱藏 overlay
    <RouterProvider />     // ④ 路由 → 子頁面 → 發 API
  </LoadingInitializer>
</LoadingProvider>
```

---

## 三、逐步執行流程

### 階段 A：App 啟動初始化

#### Step 1 — `LoadingProvider` 掛載

**檔案：`src/context/loading/LoadingProvider.jsx`**

```jsx
const [isLoading, setIsLoading] = useState(false);   // 初始為 false
const loadingCount = useRef(0);                       // 計數器，追蹤同時進行的請求數量
```

建立三個控制函式並透過 Context 提供給子元件：

| 函式               | 作用                                          |
| ------------------ | --------------------------------------------- |
| `showLoading()`    | `loadingCount +1`，若從 0→1 則 `setIsLoading(true)` |
| `hideLoading()`    | `loadingCount -1`，若歸零則 `setIsLoading(false)`   |
| `forceHideLoading()` | 直接歸零，強制 `setIsLoading(false)`            |

> **為什麼用 `loadingCount`？**
> 如果同時有 3 個 API 在跑，第一個完成時不該關 loading，要等全部完成才關。
> 計數器確保「最後一個請求完成」時才隱藏。

---

#### Step 2 — `LoadingInitializer` 掛載（橋接）

**檔案：`src/components/common/LoadingInitializer.jsx`**

```jsx
const { showLoading, hideLoading, forceHideLoading } = useLoading();

useEffect(() => {
  setLoadingController({ show: showLoading, hide: hideLoading, forceHide: forceHideLoading });
}, [showLoading, hideLoading, forceHideLoading]);
```

**關鍵作用**：Axios interceptor 是純 JS 模組，無法直接使用 React Context。
`LoadingInitializer` 扮演「橋樑」，在掛載時把 React 的函式注入到 `axiosInstance.js` 的模組變數 `loadingController`。

注入前後對比：

```js
// 注入前（axiosInstance.js 預設值）
let loadingController = {
  show: () => { },      // 空函式，呼叫不會有任何效果
  hide: () => { },
  forceHide: () => { },
}

// 注入後
loadingController = {
  show: showLoading,         // 實際會觸發 setIsLoading(true)
  hide: hideLoading,         // 實際會觸發 setIsLoading(false)
  forceHide: forceHideLoading,
}
```

---

#### Step 3 — `Loading` 元件掛載

**檔案：`src/components/common/Loading.jsx`**

```jsx
const { isLoading } = useLoading();
if (!isLoading) return null;    // isLoading=false → 不渲染任何東西

return (<div className="loading-overlay">...</div>);
```

初始 `isLoading = false`，所以頁面載入時 Loading overlay **不會出現**。

---

### 階段 B：使用者觸發 API 請求

以 `Home.jsx` 為例，掛載時自動呼叫 `api.get("/products/all")`。

---

#### Step 4 — Request Interceptor 觸發

**檔案：`src/services/api/axiosInstance.js` — `requestInterceptor`**

```
api.get("/products/all")
       │
       ▼
requestInterceptor(config) 執行：
  1. 從 cookie 取 token，加到 headers
  2. 產生唯一 requestId（例："get-/products/all-1710000000000"）
  3. 加入 pendingRequests Set
  4. 如果 pendingRequests.size === 1（第一個請求）
     → 呼叫 loadingController.show()
```

**此時的呼叫鏈**：

```
loadingController.show()
  → showLoading()                        // LoadingProvider 的函式
    → loadingCount.current: 0 → 1
    → setIsLoading(true)                 // React 狀態更新
      → Loading 元件 re-render
        → isLoading === true
          → 渲染 loading overlay ✅ 畫面出現 Loading
```

---

#### Step 5 — 等待 API 回應中...

此時 `pendingRequests` 裡有 1 個 requestId，`isLoading = true`，畫面顯示 loading。

如果此期間有**其他 API 同時發出**：
- `pendingRequests.size` 變成 2、3...
- `loadingCount` 也跟著 +1、+2...
- 但 `setIsLoading(true)` 不會重複觸發（已經是 true）

---

#### Step 6a — API 回應成功

**`responseSuccessHandler(response)` 執行：**

```
  1. 從 config 取出 _requestId
  2. 從 pendingRequests 刪除該 requestId
  3. 如果 pendingRequests.size === 0（所有請求都完成了）
     → 呼叫 loadingController.hide()
```

**呼叫鏈**：

```
loadingController.hide()
  → hideLoading()                        // LoadingProvider 的函式
    → loadingCount.current: 1 → 0
    → setIsLoading(false)                // React 狀態更新
      → Loading 元件 re-render
        → isLoading === false
          → return null ✅ Loading overlay 消失
```

---

#### Step 6b — API 回應失敗

**`responseErrorHandler(error)` 執行：**

```
  1. 從 config 取出 _requestId
  2. 從 pendingRequests 刪除該 requestId
  3. 如果 pendingRequests.size === 0
     → 呼叫 loadingController.forceHide()   // 用 forceHide 確保歸零
  4. 如果是 401 → 清除 token，導向登入頁
```

> **為什麼錯誤用 `forceHide` 而不是 `hide`？**
> 錯誤情境可能導致計數不準確（例如 request interceptor 拋錯），
> `forceHide` 直接把 `loadingCount` 歸零，確保 loading 不會卡住。

---

## 四、完整時序圖（單一請求）

```
時間軸 →

Home 掛載
  │
  ├─ api.get("/products/all")
  │    │
  │    ├─ [Request Interceptor]
  │    │    pendingRequests: { "get-...-123" }  (size=1)
  │    │    loadingController.show()
  │    │         │
  │    │         └─ showLoading() → loadingCount: 0→1 → setIsLoading(true)
  │    │              │
  │    │              └─ <Loading /> renders overlay  ← 🌶️ Loading 出現
  │    │
  │    │  ... 等待伺服器回應 ...
  │    │
  │    ├─ [Response Success Handler]
  │    │    pendingRequests: {}  (size=0)
  │    │    loadingController.hide()
  │    │         │
  │    │         └─ hideLoading() → loadingCount: 1→0 → setIsLoading(false)
  │    │              │
  │    │              └─ <Loading /> returns null     ← Loading 消失
  │    │
  │    └─ response 回到 Home → setProducts(response.data)
  │
  └─ 畫面顯示產品資料
```

---

## 五、多請求並發時序圖

```
api.get("/products/all")     ──────────────────────── response ✅
api.get("/categories")       ──────────────────────────────── response ✅
api.get("/banners")          ──────────────────────────────────────── response ✅

pendingRequests.size:   0 → 1 → 2 → 3 → 2 → 1 → 0
loadingCount:           0 → 1 → 2 → 3 → 2 → 1 → 0
isLoading:              false → true ─────────────────→ false
                              ▲                         ▲
                         第一個請求發出              最後一個回應完成
                         show() 觸發                hide() 觸發
```

---

## 六、`config.silent` 靜默模式

在 request interceptor 中有判斷：

```js
if (!config.silent) {
  // ... 才會加入 pendingRequests 和控制 loading
}
```

如果某個 API 不需要顯示 loading（例如背景輪詢），可以這樣呼叫：

```js
api.get("/some-endpoint", { silent: true });
```

這樣該請求就不會影響 loading 狀態。

---

## 七、雙層計數器的設計原因

你可能會注意到有**兩套計數機制**：

| 計數器              | 位置                    | 用途                          |
| ------------------- | ----------------------- | ----------------------------- |
| `pendingRequests`   | axiosInstance.js (Set)  | 追蹤 axios 層有多少請求正在進行 |
| `loadingCount`      | LoadingProvider (useRef)| 追蹤 React 層 show/hide 的呼叫次數 |

`pendingRequests` 確保只在「第一個請求開始 / 最後一個請求結束」時才呼叫 `show()`/`hide()`。
`loadingCount` 是額外保險，防止外部直接呼叫 `showLoading()` 多次時狀態錯亂。

---

## 八、檔案對照表

| 檔案 | 角色 |
|------|------|
| `src/context/loading/LoadingContext.js` | 建立 React Context |
| `src/context/loading/LoadingProvider.jsx` | 提供 `isLoading` 狀態 + 控制函式 |
| `src/hocks/useLoading.js` | 封裝 `useContext(LoadingContext)` 的 hook |
| `src/components/common/LoadingInitializer.jsx` | 橋接 React → Axios 模組變數 |
| `src/components/common/Loading.jsx` | 根據 `isLoading` 渲染/隱藏 overlay |
| `src/services/api/axiosInstance.js` | Axios interceptor，自動觸發 show/hide |
