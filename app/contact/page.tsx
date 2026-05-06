import type { Metadata } from "next";
import { openTo, site } from "@/lib/data";
import { ContactDashboard } from "@/components/dashboard/views/ContactDashboard";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact directory dashboard — channels, response time, open-to streams.",
};

export default function ContactPage() {
  return (
    <ContactDashboard
      email={site.contact.email}
      github={site.contact.github}
      linkedin={site.contact.linkedin}
      openTo={openTo}
      name={site.name}
      location={site.location}
    />
  );
}
