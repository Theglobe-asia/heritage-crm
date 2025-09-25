export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="hero-bg relative min-h-screen grid-overlay text-white">
      <main className="relative z-10">{children}</main>
    </div>
  );
}
