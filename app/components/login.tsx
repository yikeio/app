import * as React from "react";
import { Modal, Button } from "antd";

import {
  sendVerificationCode,
  loginUser,
  checkUser,
  activateUser,
} from "../api/user";
import { useChatStore, useBillingStore } from "../store";

import styles from "./login.module.scss";
import { showToast } from "./ui-lib";

const useUserLogin = () => {
  const [loginModalVisible, setLoginModalVisible] = React.useState(false);
  const [updateUser, getConversationList] = useChatStore((state) => [
    state.updateUser,
    state.getConversationList,
  ]);

  React.useEffect(() => {
    checkUser()
      .then((res) => {
        updateUser(res.result);
        getConversationList(res.result.id);
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

export function LoginContent({ closeModal }: { closeModal: Function }) {
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [code, setCode] = React.useState("");

  const [count, setCount] = React.useState(0);
  const timerRef = React.useRef<any>(0);

  const [updateUser, getConversationList, createConversation] = useChatStore(
    (state) => [
      state.updateUser,
      state.getConversationList,
      state.createConversation,
    ],
  );

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
    <div className={styles["login-dialog-body"]}>
      <div className={styles["login-dialog-item"]}>
        <span className={styles["login-dialog-item-label"]}>手机号</span>
        <div className={styles["login-dialog-item-value"]}>
          <span>+86</span>
          <input
            placeholder="请输入手机号"
            maxLength={11}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
      </div>
      <div className={styles["login-dialog-item"]}>
        <span className={styles["login-dialog-item-label"]}>验证码</span>
        <div className={styles["login-dialog-item-value"]}>
          <input
            placeholder="请输入验证码"
            maxLength={4}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <span className={styles["login-dialog-item-code"]} onClick={getCode}>
            {count || "获取验证码"}
          </span>
        </div>
      </div>
      <div className={styles["login-dialog-item"]}>
        <button className={styles["login-dialog-login"]} onClick={handleLogin}>
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
      closable={false}
      title="手机快捷登录"
      footer={null}
      open={loginModalVisible}
    >
      <LoginContent closeModal={setLoginModalVisible} />
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
    <Modal
      closable={false}
      title="激活账户"
      footer={
        <Button type="primary" onClick={handleActivate}>
          激活
        </Button>
      }
      open={activateVisible}
    >
      <div className={styles["login-dialog-item"]}>
        <div className={styles["login-dialog-item-value"]}>
          <input
            placeholder="请输入邀请码"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
