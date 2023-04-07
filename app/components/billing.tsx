/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { Modal } from "antd";
import { useBillingStore } from "../store";
import { getPayableQuotas, createPayment, getPayment } from "../api/pay";

import styles from "./billing.module.scss";

export function BillingDialog() {
  const [billingModalVisible, setBillingModalVisible] = useBillingStore(
    (state) => [state.billingModalVisible, state.setBillingModalVisible],
  );
  const [payableQuotas, setPayableQuotas] = React.useState<any>([]);
  const [payStatus, setPayStatus] = React.useState<number>(2); // 0：未创建订单，1:创建订单，暂时支付二维码 2：支付成功
  const [paymentDetail, setPaymentDetail] = React.useState<any>({});

  React.useEffect(() => {
    if (billingModalVisible) {
      setPayStatus(0);
      getPayableQuotas("chat").then((res) => {
        setPayableQuotas(res.result);
      });
    }
  }, [billingModalVisible]);

  /**
   * loop查询支付状态
   */
  const loopQueryPayment = (id: string) => {
    const timer = setInterval(() => {
      getPayment(id).then((res) => {
        if (res.result.state === "paid") {
          setPayStatus(2);
          clearInterval(timer);
        }
      });
    }, 3000);
  };

  /**
   * 支付
   * @param item
   */
  const handlePay = async (item: any) => {
    const res = await createPayment({
      quota_type: item.quota_type,
      pricing: item.pricing,
    });
    setPaymentDetail(res.result);
    setPayStatus(1);
    loopQueryPayment(res.result.id);
  };

  const modalTitle = React.useMemo(() => {
    return {
      0: "服务套餐",
      1: "请扫码支付",
      2: "支付成功",
    }[payStatus];
  }, [payStatus]);

  return (
    <Modal
      title={modalTitle}
      open={billingModalVisible}
      footer={null}
      onCancel={() => setBillingModalVisible(false)}
    >
      {payStatus === 0 && (
        <div className={styles["billing-modal"]}>
          {payableQuotas.map((item: any, index: number) => (
            <div key={index} className={styles["billing-card"]}>
              <div className={styles["billing-card-title"]}>{item.title}</div>
              <div className={styles["billing-card-price"]}>{item.price}</div>
              <div className={styles["billing-card-token"]}>
                {String(item.tokens_count).replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ",",
                )}
                (token)
              </div>
              <button
                className={styles["billing-card-btn"]}
                onClick={() => handlePay(item)}
              >
                购买
              </button>
            </div>
          ))}
        </div>
      )}
      {payStatus == 2 && (
        <svg
          className={styles["pay-qr-code"]}
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="6787"
          width="200"
          height="200"
        >
          <path
            d="M1014.85766044 62.93909556s-289.50747443 127.76658342-460.94447621 701.93347376L183.53797287 488.30046649s33.9634749-82.48736735 88.9550531-118.0704711c0 0 127.77199899 158.50163177 245.83705296 244.22284124 0 0 124.53273975-449.62331792 496.52758151-551.51915819z"
            fill="#16dcea"
          ></path>
          <path
            d="M469.08574902 979.02121451c-245.76121799 0-445.06235408-199.30113607-445.06235407-445.06235408s199.30113607-445.06235408 445.06235408-445.06235408a443.80023463 443.80023463 0 0 1 161.2479615 30.14461543l-54.67740266 73.3166872a358.26861331 358.26861331 0 0 0-109.45230711-17.04132262c-198.03901664 0-358.64237408 160.60335899-358.64237407 358.64237407s160.60877453 358.64237408 358.64779119 358.64237407c142.28366558 0 265.24552742-82.90987901 323.20010598-203.03874193l91.92347215 12.31785308c-66.29648517 162.54258053-225.90314939 277.14086884-412.24724698 277.14086886z"
            fill="#16dcea"
            p-id="6789"
          ></path>
        </svg>
      )}
      {payStatus === 1 && (
        <img
          src={paymentDetail.context.qrcode}
          alt=""
          className={styles["pay-qr-code"]}
        />
      )}
    </Modal>
  );
}
