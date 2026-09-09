import { ArrowRightOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { Button } from "antd";

import { AppNavbar } from "../components/AppNavbar.jsx";

export function LandingPage({
  isDark,
  onOpenAccount,
  onStartSearch,
  onToggleTheme,
  session,
}) {
  return (
    <main
      className={`landing-page relative grid min-h-screen grid-rows-[auto_1fr_auto] overflow-hidden font-sans ${
        isDark ? "theme-dark text-white" : "theme-light text-[#18221d]"
      }`}
    >
      <div
        className="absolute inset-0 overflow-hidden bg-[#06130d]"
        aria-hidden="true"
      >
        <div className="landing-background absolute inset-0" />
        <div className="landing-curve-overlay absolute inset-0" />
      </div>
      <AppNavbar
        isDark={isDark}
        onOpenAccount={onOpenAccount}
        onToggleTheme={onToggleTheme}
        session={session}
        variant="landing"
      />
      <section
        className="relative z-10 w-[calc(100%-48px)] max-w-[760px] self-center justify-self-center py-20 text-center max-[480px]:w-[calc(100%-32px)] max-[480px]:max-w-[560px]"
        id="top"
      >
        <p className="mb-3 text-xs font-semibold tracking-[0.1em] text-[#a7e4c7]">
          TEMUKAN TEMPAT PULANGMU
        </p>
        <h1 className="m-0 text-[clamp(44px,7vw,82px)] leading-[0.98] font-medium tracking-[-0.065em]">
          Mau tinggal di kawasan seperti apa?
        </h1>
        <p className="mx-auto mt-7 mb-0 max-w-[520px] text-lg leading-[1.5] max-[480px]:text-base">
          Cari kawasan dekat KRL yang sesuai dengan sewa, biaya hidup, dan waktu
          perjalananmu.
        </p>
        <Button
          className="!mt-8 !h-auto !rounded-lg !border-[#0c8c5e] !bg-[#0c8c5e] !px-[18px] !py-[11px] !text-white !shadow-none hover:!border-[#087a51] hover:!bg-[#087a51]"
          icon={<ArrowRightOutlined />}
          iconPosition="end"
          size="large"
          type="primary"
          onClick={onStartSearch}
        >
          Cari kawasan
        </Button>
      </section>
      <div className="relative z-10 flex items-center gap-2 px-8 pb-6 text-[13px] opacity-75 max-[480px]:px-4 max-[480px]:pb-5">
        <EnvironmentOutlined /> Lin Bogor
      </div>
    </main>
  );
}
