import { MoonOutlined, SunOutlined, UserOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link } from "react-router-dom";

export function AppNavbar({
  isDark,
  onOpenAccount,
  onToggleTheme,
  session,
  variant,
}) {
  const isLanding = variant === "landing";
  const textClass = isLanding
    ? isDark
      ? "!text-white"
      : "!text-[#18221d]"
    : "!text-[var(--text)]";
  const borderClass = isLanding
    ? isDark
      ? "border-white/20"
      : "border-black/15"
    : "border-[var(--border)]";

  return (
    <header
      className={`relative z-10 flex h-16 items-center justify-between border-b ${borderClass} px-6 text-sm font-medium max-[480px]:px-4`}
    >
      <Link
        className={`text-base font-semibold tracking-[-0.05em] no-underline ${
          isLanding
            ? isDark
              ? "text-white"
              : "text-[#18221d]"
            : "text-[var(--text)]"
        }`}
        to="/"
      >
        JANGKAU
      </Link>
      <div className="flex items-center gap-1">
        <Button
          aria-label={isDark ? "Gunakan tema terang" : "Gunakan tema gelap"}
          className={textClass}
          icon={isDark ? <SunOutlined /> : <MoonOutlined />}
          type="text"
          onClick={onToggleTheme}
        />
        <Button
          className={textClass}
          icon={<UserOutlined />}
          type="text"
          onClick={onOpenAccount}
        >
          {session ? session.user.name : "Masuk"}
        </Button>
      </div>
    </header>
  );
}
