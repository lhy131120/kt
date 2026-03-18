import { createRoot } from 'react-dom/client'
import App from '@/App.jsx'
import { Provider } from 'react-redux';
import { store } from '@/store';

// react-toastify
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// styles
import "@/assets/styles/Theme.css";

createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
      <App />
    </Provider>
    <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" transition={Bounce} />
  </>
)
