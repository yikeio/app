import * as React from "react";
import { Modal } from "antd";

import { useBillingStore } from "../store";

import styles from "./billing.module.scss";

export function BillingDialog() {
  const [billingModalVisible, setBillingModalVisible] = useBillingStore(
    (state) => [state.billingModalVisible, state.setBillingModalVisible],
  );

  return (
    <Modal
      title="服务套餐"
      open={billingModalVisible}
      footer={null}
      onCancel={() => setBillingModalVisible(false)}
    >
      <div className={styles["billing-modal"]}>
        <div className={styles["billing-card"]}>
          <div className={styles["billing-card-title"]}>周卡</div>
          <div className={styles["billing-card-price"]}>9.9</div>
          <div className={styles["billing-card-token"]}>30万 token</div>
          <button className={styles["billing-card-btn"]}>购买</button>
        </div>
        <div className={styles["billing-card"]}>
          <div className={styles["billing-card-title"]}>半月卡</div>
          <div className={styles["billing-card-price"]}>19.9</div>
          <div className={styles["billing-card-token"]}>70万 token</div>
          <button className={styles["billing-card-btn"]}>购买</button>
        </div>
        <div className={styles["billing-card"]}>
          <div className={styles["billing-card-title"]}>月卡</div>
          <div className={styles["billing-card-price"]}>29.9</div>
          <div className={styles["billing-card-token"]}>120万 token</div>
          <button className={styles["billing-card-btn"]}>购买</button>
        </div>
      </div>
    </Modal>
  );
}
