/**
 * PartnerSites — Cross-promotion for sister sites.
 * Part of Alaska Consulting Group.
 */

interface PartnerSite {
  name: string;
  url: string;
}

const PARTNER_SITES: PartnerSite[] = [
  { name: "Alaska Consulting Group", url: "https://alaskaconsultinggroup.com" },
  { name: "Alaska Drone Survey", url: "https://alaskadronesurvey.com" },
];

interface PartnerSitesProps {
  currentSite?: string;
}

export default function EmpireNetwork({ currentSite = "" }: PartnerSitesProps) {
  const sites = PARTNER_SITES.filter(s => !s.url.includes(currentSite));

  if (sites.length === 0) return null;

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl font-bold text-center mb-6">
          More from Alaska Consulting Group
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {sites.map((site) => (
            <a
              key={site.url}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-shadow text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600"
            >
              {site.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
