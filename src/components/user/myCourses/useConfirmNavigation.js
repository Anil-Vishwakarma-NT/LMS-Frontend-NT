import { useBlocker } from "react-router-dom";
import { useEffect, useState } from "react";
import { Modal } from "antd";

export default function useConfirmNavigation(shouldBlock, onConfirm) {
  const blocker = useBlocker(shouldBlock);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (blocker.state === "blocked" && !isModalVisible) {
      setIsModalVisible(true);

      Modal.confirm({
        title: "Leave Quiz?",
        content: "If you leave, your quiz will be auto-submitted.",
        okText: "Submit & Leave",
        cancelText: "Stay on Quiz",
        async onOk() {
          await onConfirm();          // Submit quiz
          blocker.proceed();          // Proceed with navigation
          setIsModalVisible(false);   // Reset modal state
        },
        onCancel() {
          blocker.reset();            // Cancel navigation
          setIsModalVisible(false);   // Reset modal state
        },
        centered: true
      });
    }
  }, [blocker, onConfirm, isModalVisible]);
}
