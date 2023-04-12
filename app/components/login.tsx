import * as React from "react";

import {
  sendVerificationCode,
  loginUser,
  checkUser,
  activateUser,
} from "../api/user";
import { useChatStore, useBillingStore } from "../store";

import styles from "./login.module.scss";
import Modal from "./modal";
import { showToast } from "./ui-lib";
import Avatar from "./avatar";

const useUserLogin = () => {
  const [loginModalVisible, setLoginModalVisible] = React.useState(false);
  const [updateUser, getConversationList, getUserSettings] = useChatStore(
    (state) => [
      state.updateUser,
      state.getConversationList,
      state.getUserSettings,
    ],
  );

  React.useEffect(() => {
    checkUser()
      .then((res) => {
        updateUser(res.result);
        getConversationList(res.result.id);
        getUserSettings(res.result.id);
      })
      .catch((error) => {
        showToast(error.result.message);
        setLoginModalVisible(true);
        localStorage.removeItem("login_token");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loginModalVisible, setLoginModalVisible };
};

export function LoginForm({ closeModal }: { closeModal: Function }) {
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [code, setCode] = React.useState("");

  const [count, setCount] = React.useState(0);
  const timerRef = React.useRef<any>(0);

  const [updateUser, getConversationList] = useChatStore((state) => [
    state.updateUser,
    state.getConversationList,
  ]);

  function resetForm() {
    setCode("");
    setPhoneNumber("");
    setCount(0);
  }

  function getCode() {
    if (!phoneNumber) return showToast("请填写手机号");
    if (count) return;

    setCount(60);
    // 场景值
    const params = { phoneNumber: `+86:${phoneNumber}`, scene: "login" };
    sendVerificationCode(params)
      .then(() => {
        timerRef.current = setInterval(() => {
          setCount((count) => {
            if (count <= 0) {
              clearInterval(timerRef.current);
              return 0;
            }
            return count - 1;
          });
        }, 1000);
      })
      .catch((error) => {
        showToast(error.result.message);

        setCount(0);
        clearInterval(timerRef.current);
      });
  }

  // 登录
  function handleLogin() {
    if (!code) return showToast("请填写验证码");
    if (!phoneNumber) return showToast("请填写手机号");

    const params = { phoneNumber: `+86:${phoneNumber}`, code };
    loginUser(params)
      .then((res) => {
        localStorage.setItem("login_token", res.result.value);
        closeModal();
        resetForm();
        showToast("登录成功");

        checkUser().then((res) => {
          updateUser(res.result);
          getConversationList(res.result.id);
        });
      })
      .catch((error) => {
        showToast(error.result.message);
      });
  }

  return (
    <div className="flex flex-col max-w-xs gap-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl">快捷登录</h1>
        <p className="text-sm text-gray-500">
          输入您的手机号和验证码，即可快速获得超棒体验
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="phone-number-input"
          className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
        >
          手机号
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            +86
          </div>
          <input
            type="text"
            id="phone-number-input"
            className="bg-gray-50 shadow-sm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="请输入手机号"
            maxLength={11}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
      </div>
      <div className="relative flex flex-col gap-2">
        <label
          htmlFor="verify-code-input"
          className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
        >
          验证码
        </label>
        <div className="relative">
          <input
            type="password"
            id="verify-code-input"
            className="bg-gray-50 shadow-sm pr-24 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="请输入验证码"
            maxLength={4}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            className="absolute inset-y-0 right-0 z-10 flex items-center pr-3 text-blue-800 cursor-pointer"
            onClick={getCode}
          >
            {count || "获取验证码"}
          </button>
        </div>
      </div>
      <div className={styles["login-dialog-item"]}>
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={handleLogin}
        >
          登录
        </button>
      </div>
    </div>
  );
}

export function HeroCard() {
  return (
    <div className="flex flex-col items-center max-w-sm gap-8 p-12 py-24 text-gray-800 bg-gray-200">
      <h1 className="text-2xl leading-relaxed text-gray-600">
        <span className="text-3xl font-semibold text-gray-400">“</span>
        无论你从事什么行业，你一定会爱上这个万能助手！
        <span className="text-3xl font-semibold text-gray-400">”</span>
      </h1>
      <div className="flex flex-col items-center gap-4">
        <Avatar src="https://easywechat.com/overtrue.jpg" alt="" size="lg" />
        <div className="text-center">
          <h3 className="font-bold">overtrue</h3>
          <p className="text-gray-500">高级工程师、设计师</p>
        </div>
      </div>
    </div>
  );
}

export function LoginDialog() {
  const { loginModalVisible, setLoginModalVisible } = useUserLogin();
  const [user] = useChatStore((state) => [state.user]);
  const [getUserQuotaInfo] = useBillingStore((state) => [
    state.getUserQuotaInfo,
  ]);

  React.useEffect(() => {
    if (!user.id && !localStorage.getItem("login_token")) {
      setLoginModalVisible(true);
    }

    if (user.id && localStorage.getItem("login_token")) {
      // 获取用户的套餐信息
      getUserQuotaInfo(user.id);
    }
  }, [user]);

  return (
    <Modal
      size="lg"
      show={loginModalVisible}
      noPadding
      onClose={() => setLoginModalVisible(false)}
    >
      <div className="flex">
        <div className="flex items-center justify-center w-1/2 p-8">
          <LoginForm closeModal={setLoginModalVisible} />
        </div>
        <div className="w-1/2">
          <HeroCard />
        </div>
      </div>
    </Modal>
  );
}

// 激活弹窗
export function ActivateDialog() {
  const [inviteCode, setInviteCode] = React.useState("");
  const [user] = useChatStore((state) => [state.user]);
  const [activateVisible, setActivateVisible] = useBillingStore((state) => [
    state.activateVisible,
    state.setActivateVisible,
  ]);

  function handleActivate() {
    if (!inviteCode) return showToast("请输入邀请码");
    activateUser({ userId: user.id, inviteCode })
      .then(() => {
        showToast("激活成功");
        setActivateVisible(false);
      })
      .catch((error) => {
        showToast(error.result.message);
      });
  }

  return (
    <Modal show={activateVisible} onClose={() => setActivateVisible(false)}>
      <div className={styles["login-dialog-item"]}>
        <div className={styles["login-dialog-item-value"]}>
          <input
            placeholder="请输入邀请码"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
        </div>
      </div>
      <button
        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        onClick={handleActivate}
      >
        激活
      </button>
    </Modal>
  );
}
