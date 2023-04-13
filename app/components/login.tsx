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
import Image from "next/image";

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
            className="block w-full pl-12 p-2.5"
            placeholder="请输入手机号"
            maxLength={11}
            autoFocus={true}
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
            type="text"
            id="verify-code-input"
            className="pr-24 w-full"
            placeholder="请输入验证码"
            maxLength={4}
            value={code}
            autoComplete="off"
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
      size="sm"
      show={loginModalVisible}
      noPadding
      onClose={() => setLoginModalVisible(false)}
    >
      <div className="p-8 space-y-4">
        <div className="flex items-center justify-center">
          <Image src="/logo.svg" alt="" height={80} width={80} />
        </div>
        <div className="flex items-center justify-center">
          <LoginForm closeModal={setLoginModalVisible} />
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
      <div className="flex flex-col gap-6">
        <input
          type="text"
          className="block"
          placeholder="请输入邀请码"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
        />
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={handleActivate}
        >
          激活
        </button>
      </div>
    </Modal>
  );
}
