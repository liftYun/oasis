export default function CreateStayLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className="flex flex-col items-center overflow-y-auto scrollbar-hide">
        {children}
      </section>
    </>
  );
}
