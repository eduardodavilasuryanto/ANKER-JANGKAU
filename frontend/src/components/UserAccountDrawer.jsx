import { DeleteOutlined, LoginOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, Input } from "antd";
import { useState } from "react";

export function UserAccountDrawer({
  onClose,
  onDeleteSearch,
  onLoadSearch,
  onLogout,
  onSubmit,
  open,
  savedSearches,
  session,
}) {
  const [mode, setMode] = useState("login");

  if (session) {
    return (
      <Drawer title="Akun saya" open={open} onClose={onClose} size="default">
        <div className="grid gap-6">
          <div>
            <p className="m-0 text-base font-medium">{session.user.name}</p>
            <p className="mt-1 mb-0 text-sm text-[var(--muted)]">
              {session.user.email}
            </p>
          </div>
          <section>
            <h2 className="m-0 text-sm font-semibold">Pencarian tersimpan</h2>
            {savedSearches.length ? (
              <div className="mt-3 grid divide-y divide-[var(--border)] border-y border-[var(--border)]">
                {savedSearches.map((search) => (
                  <div className="flex items-center gap-2 py-3" key={search.id}>
                    <button
                      className="min-w-0 flex-1 border-0 bg-transparent p-0 text-left text-[var(--text)]"
                      type="button"
                      onClick={() => onLoadSearch(search)}
                    >
                      <strong className="block truncate text-sm font-medium">
                        {search.label}
                      </strong>
                      <span className="mt-1 block text-xs text-[var(--muted)]">
                        {new Date(search.updated_at).toLocaleDateString(
                          "id-ID",
                        )}
                      </span>
                    </button>
                    <Button
                      aria-label={`Hapus ${search.label}`}
                      icon={<DeleteOutlined />}
                      type="text"
                      onClick={() => onDeleteSearch(search.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 mb-0 text-sm leading-6 text-[var(--muted)]">
                Simpan pencarian untuk membukanya lagi di sini.
              </p>
            )}
          </section>
          <Button icon={<LoginOutlined />} onClick={onLogout}>
            Keluar
          </Button>
        </div>
      </Drawer>
    );
  }

  const isSignUp = mode === "sign-up";
  return (
    <Drawer
      title={isSignUp ? "Buat akun" : "Masuk"}
      open={open}
      onClose={onClose}
      size="default"
    >
      <p className="mt-0 mb-6 text-sm leading-6 text-[var(--muted)]">
        Masuk untuk menyimpan pencarian dan membukanya kembali nanti.
      </p>
      <Form
        className="grid gap-1"
        layout="vertical"
        onFinish={(values) => onSubmit(mode, values)}
      >
        {isSignUp ? (
          <Form.Item
            label="Nama"
            name="name"
            rules={[{ required: true, message: "Masukkan nama." }]}
          >
            <Input autoComplete="name" />
          </Form.Item>
        ) : null}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Masukkan email yang valid.",
            },
          ]}
        >
          <Input autoComplete="email" inputMode="email" />
        </Form.Item>
        <Form.Item
          label="Kata sandi"
          name="password"
          rules={[
            { required: true, min: 8, message: "Gunakan minimal 8 karakter." },
          ]}
        >
          <Input.Password
            autoComplete={isSignUp ? "new-password" : "current-password"}
          />
        </Form.Item>
        <Button className="!mt-2 !h-10" htmlType="submit" type="primary">
          {isSignUp ? "Buat akun" : "Masuk"}
        </Button>
      </Form>
      <Button
        className="!mt-4 !px-0"
        type="link"
        onClick={() => setMode(isSignUp ? "login" : "sign-up")}
      >
        {isSignUp ? "Sudah punya akun? Masuk" : "Belum punya akun? Buat akun"}
      </Button>
    </Drawer>
  );
}
