import { useBlocker } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Modal } from "antd";

/**
 * Custom hook to block navigation with a confirmation modal.
 *
 * @param {boolean} shouldBlock - Whether navigation should be blocked.
 * @param {Function} onConfirm - Function to call when user confirms navigation.
 * @param {boolean} isSubmitting - If true, navigation is allowed (skip blocker during submit).
 */
export default function useConfirmNavigation(shouldBlock, onConfirm, isSubmitting = false) {
  const shouldBlockRef = useRef(shouldBlock);
  const [isHandling, setIsHandling] = useState(false);

  // Update ref when shouldBlock changes
  useEffect(() => {
    shouldBlockRef.current = shouldBlock;
  }, [shouldBlock]);

  // Block navigation only if not submitting
  const blocker = useBlocker(() => shouldBlockRef.current && !isSubmitting);

  useEffect(() => {
    if (blocker.state === "blocked" && !isHandling) {
      setIsHandling(true);

      Modal.confirm({
        title: "Leave Quiz?",
        content: "If you leave, your quiz will be auto-submitted.",
        okText: "Submit & Leave",
        cancelText: "Stay on Quiz",
        centered: true,
        async onOk() {
          try {
            await onConfirm();
            blocker.proceed(); // Proceed navigation after handling
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

  // Cleanup if navigation is unblocked
  useEffect(() => {
    if (blocker.state === "unblocked") {
      Modal.destroyAll();
      setIsHandling(false);
    }
  }, [blocker.state]);
}
