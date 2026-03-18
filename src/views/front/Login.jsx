import { useNavigate, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from "react";

// Images Resources
import logo from "@/images/logo-color.png";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggingIn: isLoading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, } = useForm({
    defaultValues: {
      username: "",
      password: "",
    }
  });

  const onSubmit = (data) => {

  }

  return (
    <>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 bg-secondary-30/30">
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4">
              <img src={logo} alt="小廚旅人 Logo" className="w-48 mx-auto" />
            </Link>
            <p className="text-secondary-50 text-sm tracking-wide">歡迎回來，登入以管理您的帳戶</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10 border border-secondary-30/50">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-secondary-50 mb-1.5">
                  電子郵件
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-secondary-60">mail</span>
                  <input
                    {...register("username", {
                      required: "請輸入電子郵件",
                      pattern: { value: /^\S+@\S+$/i, message: "請輸入有效的電子郵件地址" },
                    })}
                    type="email"
                    id="username"
                    name="username"
                    placeholder="example@mail.com"
                    className="inputText w-full pl-10"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-secondary-50 mb-1.5">
                  密碼
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-secondary-60">lock</span>
                  <input
                    {...register("password", {
                      required: "請輸入密碼",
                      minLength: { value: 6, message: "密碼至少需要6個字元" },
                    })}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="輸入您的密碼"
                    className="inputText w-full pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute block w-6 h-6 right-3 top-1/2 -translate-y-1/2 text-secondary-60 hover:text-secondary-50 transition-colors cursor-pointer"
                    aria-label={showPassword ? "隱藏密碼" : "顯示密碼"}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn w-full flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                    登入中...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">login</span>
                    登入
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Back to Home */}
          <p className="text-center mt-6 text-sm text-secondary-50">
            <Link to="/" className="inline-flex items-center gap-1 text-primary-20 hover:text-primary-10 transition-colors font-medium">
              <span className="material-symbols-outlined text-base">arrow_back</span>
              返回首頁
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default Login;