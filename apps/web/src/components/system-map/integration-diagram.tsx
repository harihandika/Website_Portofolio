import Link from "next/link";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Database,
  Factory,
  type LucideIcon,
} from "lucide-react";

type SystemModule = {
  title: string;
  href: string;
  stages: string[];
  handoff?: string;
};

type Zone = {
  id: string;
  title: string;
  icon: LucideIcon;
  modules: SystemModule[];
};

const zones: Zone[] = [
  {
    id: "field",
    title: "Suppliers & plant teams",
    icon: Building2,
    modules: [
      {
        title: "Supplier Portal",
        href: "#supplier-portal",
        stages: ["Purchase order", "Delivery order", "Goods receipt"],
        handoff: "Order to supplier, delivery details to receiving",
      },
      {
        title: "Maintenance",
        href: "#maintenance-module",
        stages: ["Preventive service", "Breakdown response", "Spare parts"],
        handoff: "Spare-parts needs to warehouse",
      },
    ],
  },
  {
    id: "erp",
    title: "MCFrame ERP",
    icon: Database,
    modules: [
      {
        title: "Purchasing & receiving",
        href: "/projects/purchasing-accounting",
        stages: ["Purchase order", "Delivery schedule", "Receipt result"],
      },
      {
        title: "Warehouse & inventory",
        href: "#warehouse-module",
        stages: ["Item & location mapping", "Stock & units", "Goods issue", "Stock transfer"],
      },
      {
        title: "Manufacturing records",
        href: "/projects/dekidaka",
        stages: ["Production orders", "Material usage", "Production results"],
      },
    ],
  },
  {
    id: "apps",
    title: "Operational applications",
    icon: Factory,
    modules: [
      {
        title: "Purchase Request",
        href: "/projects/purchasing-accounting",
        stages: ["Requisition", "Budget review", "Approval"],
        handoff: "Approved requisition to purchasing",
      },
      {
        title: "Transfer Request",
        href: "/projects/mcframe-movement",
        stages: ["Material request", "Warehouse mapping", "Movement review"],
        handoff: "Transfer details to warehouse and inventory",
      },
      {
        title: "Production",
        href: "/projects/dekidaka",
        stages: ["Production plan", "Shift results", "Quality inspection"],
        handoff: "Production results to manufacturing records",
      },
    ],
  },
];

const handoffs = [
  { area: "supplier", side: "out", label: "PO / delivery", icon: ArrowLeftRight },
  { area: "spares", side: "out", label: "Spare-parts need", icon: ArrowRight },
  { area: "purchase", side: "in", label: "Approved request", icon: ArrowLeft },
  { area: "transfer", side: "in", label: "Stock movement", icon: ArrowLeft },
  { area: "results", side: "in", label: "Production results", icon: ArrowLeft },
];

export function IntegrationDiagram() {
  return (
    <figure className="systems-wrap map-figure" aria-labelledby="map-diagram-title">
      <div className="map-figure-top">
        <h2 id="map-diagram-title">Manufacturing integration landscape</h2>
        <span>Conceptual architecture</span>
      </div>
      <div className="map-diagram">
        {zones.map(({ id, title, icon: Icon, modules }) => (
          <section className={`map-zone map-zone-${id}`} key={id} aria-labelledby={`map-zone-${id}`}>
            <h3 id={`map-zone-${id}`}>
              <Icon size={19} aria-hidden="true" /> {title}
            </h3>
            <ul className="map-nodes">
              {modules.map(({ title: moduleTitle, href, stages, handoff }) => {
                const isWorkflow = href.startsWith("#");
                const ModuleLink = isWorkflow ? "a" : Link;
                const JumpIcon = isWorkflow ? ArrowDownRight : ArrowUpRight;

                return (
                  <li key={moduleTitle} className="map-node">
                    <ModuleLink href={href}>
                      <h4>
                        {moduleTitle} <JumpIcon size={15} aria-hidden="true" />
                      </h4>
                      <ul className="map-node-stages">
                        {stages.map((stage) => <li key={stage}>{stage}</li>)}
                      </ul>
                    </ModuleLink>
                    {handoff && <p className="map-mobile-handoff">{handoff}</p>}
                  </li>
                );
              })}
            </ul>
            {id === "erp" && (
              <div className="map-accounting">
                <ArrowDown size={16} aria-hidden="true" />
                <div>
                  <h4>Accounting & cost analysis</h4>
                  <p>Receipts and inventory movements inform financial review.</p>
                </div>
              </div>
            )}
          </section>
        ))}
        {handoffs.map(({ area, side, label, icon: Icon }) => (
          <div
            key={area}
            className={`map-bridge map-bridge-${side} map-bridge-${area}`}
            aria-hidden="true"
          >
            <span>{label}</span>
            <div className="map-bridge-line"><Icon size={19} /></div>
          </div>
        ))}
      </div>
      <figcaption>
        <span className="map-legend"><ArrowRight size={16} aria-hidden="true" /> Business handoff</span>
        <span>Portfolio overview of business processes and system responsibilities.</span>
      </figcaption>
    </figure>
  );
}
