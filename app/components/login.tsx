import * as React from "react";
import { Modal, ModalProps, Tooltip } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { sendVerificationCode, loginUser, createUser } from "../api/user";

import styles from "./login.module.scss";
import { showToast } from "./ui-lib";

export function LoginContent() {
  const [showInviteLink, setShowInviteLink] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [code, setCode] = React.useState("");
  const [inviteCode, setInviteCode] = React.useState("");

  const [count, setCount] = React.useState(0);
  const timerRef = React.useRef<any>(0);

  function handleRegistry() {
    setCount(0);
    setCode("");
    setShowInviteLink(true);
  }

  function getCode() {
    if (count) return;

    setCount(60);
    // 场景值
    const scene = showInviteLink ? "register" : "login";
    const params = { phoneNumber: `+86:${phoneNumber}`, scene };
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

  function handleLogin() {
    const params = { phoneNumber: `+86:${phoneNumber}`, code };
    loginUser(params)
      .then((res) => {
        console.log("succ", res);
      })
      .catch((error) => {
        showToast(error.result.message);
      });
  }

  function handleRegister() {
    if (!inviteCode) return showToast("请填写邀请码");

    const params = { phoneNumber: `+86:${phoneNumber}`, code, inviteCode };
    createUser(params)
      .then((res) => {
        console.log("handleRegister", res);
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
      {showInviteLink && (
        <div className={styles["login-dialog-item"]}>
          <span className={styles["login-dialog-item-label"]}>
            邀请码
            <Tooltip title="须通过邀请码才可注册">
              <ExclamationCircleOutlined />
            </Tooltip>
          </span>
          <div className={styles["login-dialog-item-value"]}>
            <input
              placeholder="请输入邀请码"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
            />
          </div>
        </div>
      )}
      <div className={styles["login-dialog-item"]}>
        <button
          className={styles["login-dialog-login"]}
          onClick={showInviteLink ? handleRegister : handleLogin}
        >
          {showInviteLink ? "注册并登录" : "登陆"}
        </button>
        {!showInviteLink && (
          <button
            className={styles["login-dialog-registry"]}
            onClick={handleRegistry}
          >
            立即注册
          </button>
        )}
      </div>
    </div>
  );
}

export function LoginDialog(props: ModalProps) {
  return (
    <Modal closable={false} title="手机快捷登录" footer={null} {...props}>
      <LoginContent />
    </Modal>
  );
}

export const setLogin = () => {
  Modal.info({
    icon: null,
    title: "手机快捷登录",
    content: <LoginContent />,
    footer: null,
  });
};
