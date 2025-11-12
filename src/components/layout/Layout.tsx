"use client";

import { useModalStore } from "@/store/useModalStore";
import Modal from "@/components/ui/Modal";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { isAiFinderModalOpen, closeAiFinderModal } = useModalStore();

  return (
    <>
      {children}
      {isAiFinderModalOpen && (
        <Modal
          isOpen={isAiFinderModalOpen}
          onClose={closeAiFinderModal}
          title="کشف عطر هوشمند"
        >
          <div className="p-6">
            <p>محتوای کشف عطر</p>
          </div>
        </Modal>
      )}
    </>
  );
}
