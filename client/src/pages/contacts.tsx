import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BackgroundPattern } from "@/components/background-pattern";
import { StatCard } from "@/components/stat-card";
import { SearchBar } from "@/components/search-bar";
import { LoadingSpinner } from "@/components/loading-spinner";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Users, Building2, Phone, Mail, Plus, Edit2, Trash2 } from "lucide-react";
import type { Contact, ContactStats } from "@shared/schema";

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [agencyFilter, setAgencyFilter] = useState<string>("all");

  const { data: contacts = [], isLoading } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  const stats: ContactStats = {
    totalContacts: contacts.length,
    agencies: [...new Set(contacts.map(c => c.agency))].length,
    phoneNumbers: contacts.filter(c => c.phoneNumber).length,
    emailAddresses: contacts.filter(c => c.email).length,
  };

  const agencies = [...new Set(contacts.map(c => c.agency))];

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.designation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAgency = agencyFilter === "all" || contact.agency === agencyFilter;
    return matchesSearch && matchesAgency;
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#1A1E32" }}>
      <BackgroundPattern />
      <Header title="CONTACT DIRECTORY" showBack />

      <main className="flex-1 relative z-10 px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div 
            className="rounded-3xl p-6 md:p-8"
            style={{
              background: "rgba(14, 33, 72, 0.85)",
              backdropFilter: "blur(25px)",
              border: "1px solid rgba(121, 101, 193, 0.4)",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)"
            }}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8 pb-6 border-b-2" style={{ borderColor: "rgba(121, 101, 193, 0.4)" }}>
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #6F42C1, #6F42C1CC)" }}
                >
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h2 
                  className="text-2xl md:text-3xl font-extrabold"
                  style={{ color: "#E3D095", textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)" }}
                  data-testid="text-contacts-title"
                >
                  Contact Directory
                </h2>
              </div>
              <SearchBar 
                value={searchQuery} 
                onChange={setSearchQuery} 
                placeholder="Search contacts by name, agency, or designation..." 
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={Users} value={stats.totalContacts} label="Total Contacts" color="#6F42C1" loading={isLoading} />
              <StatCard icon={Building2} value={stats.agencies} label="Agencies" color="#007BFF" loading={isLoading} />
              <StatCard icon={Phone} value={stats.phoneNumbers} label="Phone Numbers" color="#28A745" loading={isLoading} />
              <StatCard icon={Mail} value={stats.emailAddresses} label="Email Addresses" color="#E69500" loading={isLoading} />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <select
                value={agencyFilter}
                onChange={(e) => setAgencyFilter(e.target.value)}
                className="px-4 py-2 rounded-lg text-sm font-medium outline-none"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#E3D095",
                  border: "1px solid rgba(121, 101, 193, 0.4)"
                }}
                data-testid="select-agency"
              >
                <option value="all">All Agencies</option>
                {agencies.map(agency => (
                  <option key={agency} value={agency}>{agency}</option>
                ))}
              </select>

              <Button
                className="rounded-lg px-4 gap-2"
                style={{ background: "#6F42C1", color: "white" }}
                data-testid="button-add-contact"
              >
                <Plus className="w-4 h-4" />
                Add Contact
              </Button>
            </div>

            {isLoading ? (
              <LoadingSpinner message="Loading contacts..." />
            ) : filteredContacts.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No contacts found"
                description={searchQuery ? "Try adjusting your search criteria." : "Start by adding your first contact."}
                actionLabel="Add Contact"
                onAction={() => {}}
              />
            ) : (
              <div 
                className="rounded-xl overflow-hidden"
                style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)" }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
                    <thead>
                      <tr style={{ background: "linear-gradient(135deg, #7965C1, #483AA0)" }}>
                        <th className="text-left px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white">Name</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white hidden md:table-cell">Agency</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white hidden lg:table-cell">Designation</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white">Phone</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white hidden md:table-cell">Email</th>
                        <th className="text-center px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContacts.map((contact, idx) => (
                        <tr 
                          key={contact.id}
                          className="transition-all duration-200 hover:scale-[1.01]"
                          style={{ 
                            background: idx % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.03)",
                            borderBottom: "1px solid rgba(121, 101, 193, 0.2)"
                          }}
                          data-testid={`row-contact-${contact.id}`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                                style={{ background: "linear-gradient(135deg, #6F42C1, #f30059)", color: "white" }}
                              >
                                {contact.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                              </div>
                              <span className="font-semibold" style={{ color: "#E3D095" }}>{contact.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell" style={{ color: "#E3D095" }}>{contact.agency}</td>
                          <td className="px-4 py-3 hidden lg:table-cell" style={{ color: "#E3D095" }}>{contact.designation}</td>
                          <td className="px-4 py-3">
                            <a 
                              href={`tel:${contact.phoneNumber}`}
                              className="flex items-center gap-2 hover:underline"
                              style={{ color: "#E3D095" }}
                            >
                              <Phone className="w-4 h-4" style={{ color: "#f30059" }} />
                              {contact.phoneNumber}
                            </a>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <a 
                              href={`mailto:${contact.email}`}
                              className="flex items-center gap-2 hover:underline"
                              style={{ color: "#E3D095" }}
                            >
                              <Mail className="w-4 h-4" style={{ color: "#f30059" }} />
                              {contact.email}
                            </a>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                className="p-2 rounded-lg transition-colors hover:bg-white/10"
                                style={{ color: "#E3D095" }}
                                data-testid={`button-edit-${contact.id}`}
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                className="p-2 rounded-lg transition-colors hover:bg-white/10"
                                style={{ color: "#DC3545" }}
                                data-testid={`button-delete-${contact.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
