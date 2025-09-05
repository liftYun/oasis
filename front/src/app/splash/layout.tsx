export default function SplashLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-dvh flex items-center justify-center bg-white">{children}</section>
  );
}
