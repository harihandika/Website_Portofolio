import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { IntegrationDiagram } from "@/components/system-map/integration-diagram";
import { MapActions } from "@/components/system-map/map-actions";
import { operationalFlows } from "@/lib/data/operational-flows";
import "./system-map.css";

export const metadata: Metadata = {
  title: "Manufacturing Systems Map | Hari Handika Setiawan",
  description:
    "Follow supplier, warehouse and maintenance workflows and their handoffs with purchasing, manufacturing and MCFrame ERP.",
  openGraph: {
    title: "Manufacturing Systems Map | Hari Handika Setiawan",
    description:
      "An integration diagram and three operational workflows from Hari Handika Setiawan’s software engineering portfolio.",
    type: "website",
  },
};

export default function SystemMapPage() {
  return (
    <div className="systems-page">
      <header className="systems-wrap systems-header">
        <Link href="/projects" className="map-back">
          <ArrowLeft size={15} /> Selected work
        </Link>
        <div className="map-heading">
          <div>
            <h1>Manufacturing systems map</h1>
            <p className="map-intro">
              How suppliers and plant teams exchange orders, stock movements
              and production results with MCFrame ERP.
            </p>
          </div>
          <MapActions />
        </div>
      </header>

      <IntegrationDiagram />

      <section className="systems-wrap flow-catalog" aria-labelledby="flows-title">
        <h2 id="flows-title">Operational workflows</h2>
        {operationalFlows.map((flow) => (
          <article className="map-flow" key={flow.slug} id={flow.slug}>
            <header>
              <div>
                <h3>{flow.title}</h3>
                <p>{flow.description}</p>
              </div>
              <Link href={`/projects/${flow.slug}`}>
                Case study <ArrowUpRight size={15} />
              </Link>
            </header>
            <ol className="map-steps">
              {flow.steps.map(({ owner, title, detail }, index) => (
                <li key={title}>
                  <span className="map-step-owner">
                    {String(index + 1).padStart(2, "0")} <i /> {owner}
                  </span>
                  <h4>{title}</h4>
                  <p>{detail}</p>
                </li>
              ))}
            </ol>
            <dl className="map-exceptions" aria-label="Exception paths">
              {flow.exceptions.map(({ title, detail }) => (
                <div key={title}>
                  <dt>{title}</dt>
                  <dd>{detail}</dd>
                </div>
              ))}
            </dl>
            <p className="map-boundary">{flow.boundary}</p>
          </article>
        ))}
        <p className="map-credit">Hari Handika Setiawan · Software Engineer, ERP Integration</p>
      </section>
    </div>
  );
}
