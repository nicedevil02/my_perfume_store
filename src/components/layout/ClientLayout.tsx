"use client";

import { usePathname } from "next/navigation";
import { useModalStore } from "@/store/useModalStore";
import Modal2 from "@/components/ui/Modal2";
import SmartPerfumeFinder from "@/components/aiFinders/SmartPerfumeFinder";
import MoodPerfumeFinder from "@/components/aiFinders/MoodPerfumeFinder";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/auth/login";
  const { isAiFinderModalOpen, closeAiFinderModal } = useModalStore();

  return (
    <>
      {!isAuthPage && <Header />}
      {children}
      {!isAuthPage && <Footer />}

      {/* Modal برای AI Finder */}
      <Modal2 isOpen={isAiFinderModalOpen} onClose={closeAiFinderModal}>
        <div className="space-y-6">
          <SmartPerfumeFinder />
          <MoodPerfumeFinder />
        </div>
      </Modal2>
    </>
  );
}
