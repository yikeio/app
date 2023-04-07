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
  const [payStatus, setPayStatus] = React.useState<number>(0); // 0：未创建订单，1:创建订单，暂时支付二维码 2：支付成功
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
          style={{ color: "rgb(6, 180, 100)" }}
          className={styles["pay-qr-code"]}
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="6787"
          width="200"
          height="200"
        >
          <path
            d="M501.009067 0C224.50176 0 0.395947 229.198507 0.395947 512s224.105813 512 500.626773 512c276.514133 0 500.619947-229.198507 500.619947-512S777.434453 0 501.015893 0z m-39.103147 732.99968L257.938773 514.300587l52.210347-44.305067L428.168533 567.405227c48.011947-60.299947 155.56608-180.599467 303.506774-276.39808l12.417706 30.399146c-135.816533 131.50208-247.186773 316.798293-282.187093 411.600214z"
            fill="currentcolor"
            p-id="2857"
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
