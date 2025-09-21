export default function ReservationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className="flex flex-col flex-1 items-center overflow-y-auto scrollbar-hide">
        {children}
      </section>
    </>
  );
}
