import { useBlocker } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Modal } from "antd";

export default function useConfirmNavigation(shouldBlock, onConfirm) {
  const shouldBlockRef = useRef(shouldBlock);
  const blocker = useBlocker(() => shouldBlockRef.current);
  const [isHandling, setIsHandling] = useState(false);

  useEffect(() => {
    shouldBlockRef.current = shouldBlock;
  }, [shouldBlock]);

  useEffect(() => {
    if (blocker.state === "blocked" && !isHandling) {
      setIsHandling(true); // Prevent multiple modals

      Modal.confirm({
        title: "Leave Quiz?",
        content: "If you leave, your quiz will be auto-submitted.",
        okText: "Submit & Leave",
        cancelText: "Stay on Quiz",
        centered: true,
        async onOk() {
          try {
            await onConfirm();
            blocker.proceed();
          } catch (err) {
            console.error("Auto-submit failed", err);
          } finally {
            Modal.destroyAll();
            setIsHandling(false);
          }
        },
        onCancel() {
          blocker.reset();
          setIsHandling(false);
        }
      });
    }
  }, [blocker, onConfirm, isHandling]);

  useEffect(() => {
    // Cleanup if unmounted or navigation completes
    if (blocker.state === "unblocked") {
      Modal.destroyAll();
      setIsHandling(false);
    }
  }, [blocker.state]);
}