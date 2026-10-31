
import catalog from "@/data/catalog.json";
import PhoneDetail from "@/components/PhoneDetail";

// Every phone gets a prerendered page at build time, which is what lets the
// static export serve /phone/<id> without a server.
export const dynamicParams = false;

export function generateStaticParams() {
  return (catalog as { phones: { id: string }[] }).phones.map((phone) => ({
    id: phone.id,
  }));
}

export default function PhonePage({ params }: { params: { id: string } }) {
  return <PhoneDetail id={params.id} />;
}
