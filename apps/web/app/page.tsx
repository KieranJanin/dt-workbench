import { Breadcrumb } from "@repo/ui/components/Breadcrumb";
import { LeftSidebar } from "@repo/ui/components/LeftSidebar";
import { RightSidebar } from "@repo/ui/components/RightSidebar";
import { MainViewport } from "@repo/ui/components/MainViewport";
import { PromptOverlay } from "@repo/ui/components/PromptOverlay";
import { Toast } from "@repo/ui/components/Toast";

export default function Home() {
  return (
    <div className="flex flex-col h-screen text-foreground relative overflow-hidden">
      {/* Main App Body */}
      <div className="flex flex-1 overflow-hidden pb-16">
        <LeftSidebar />
        <MainViewport />
        <RightSidebar />
      </div>

      {/* Global Overlays & Nav */}
      <Breadcrumb />
      <PromptOverlay />
      <Toast />
    </div>
  );
}
