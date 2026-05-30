import EmergencyCard from "./EmergencyCard";

const EmergencyList = () => {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2, 3, 4].map((item) => (
        <EmergencyCard key={item} />
      ))}
    </section>
  );
};

export default EmergencyList;
