type FlowDetail = { title: string; detail: string };

type OperationalFlow = {
  slug: string;
  title: string;
  description: string;
  steps: readonly (FlowDetail & { owner: string })[];
  exceptions: readonly FlowDetail[];
  boundary: string;
};

export const operationalFlows = [
  {
    slug: "supplier-portal",
    title: "Supplier Portal",
    description:
      "Carry the purchase order reference from purchasing through delivery, receiving and invoice review.",
    steps: [
      {
        owner: "Purchasing",
        title: "Issue the purchase order",
        detail: "Give the supplier the order reference, item quantities and expected delivery date.",
      },
      {
        owner: "Supplier & purchasing",
        title: "Confirm delivery details",
        detail: "Check expected quantities and timing against the order. Review changes with purchasing.",
      },
      {
        owner: "Supplier",
        title: "Reference the delivery order",
        detail: "Associate the delivery order and shipment quantities with the original purchase order.",
      },
      {
        owner: "Receiving",
        title: "Verify incoming goods",
        detail: "Match delivered items against the order and record accepted quantities and discrepancies.",
      },
      {
        owner: "Purchasing",
        title: "Review open quantities",
        detail: "Check the remaining balance and confirm whether another delivery is expected.",
      },
      {
        owner: "Accounting",
        title: "Review the invoice",
        detail: "Compare invoice lines with the purchase order and recorded receipt before processing.",
      },
    ],
    exceptions: [
      { title: "Partial delivery", detail: "Keep the outstanding quantity open and confirm a revised delivery date." },
      { title: "Receipt or invoice mismatch", detail: "Refer the affected lines to purchasing and receiving for review." },
    ],
    boundary: "Portfolio scope covers supplier-facing purchasing coordination. Receiving and invoice review illustrate downstream handoffs.",
  },
  {
    slug: "warehouse-module",
    title: "Warehouse Module",
    description:
      "Follow a material request through location mapping, warehouse preparation and ERP reconciliation.",
    steps: [
      {
        owner: "Requesting team",
        title: "Request material",
        detail: "Capture the item, requested quantity, unit and destination department or production line.",
      },
      {
        owner: "Warehouse",
        title: "Resolve stock locations",
        detail: "Map the department and line to the source warehouse and, for transfers, the destination warehouse.",
      },
      {
        owner: "Warehouse",
        title: "Validate quantity and units",
        detail: "Apply the item’s unit or packaging conversion and compare the converted request with available stock.",
      },
      {
        owner: "Warehouse",
        title: "Prepare the requested stock",
        detail: "Select the items and check prepared quantities against the request before handoff.",
      },
      {
        owner: "Warehouse & ERP",
        title: "Record the issue or transfer",
        detail: "Capture the actual issue or transfer quantity, stock locations and request reference for ERP movement mapping.",
      },
      {
        owner: "ERP reconciliation",
        title: "Reconcile the movement",
        detail: "Compare references, quantities and locations across systems before closing the request.",
      },
    ],
    exceptions: [
      { title: "Insufficient stock", detail: "Review the quantity that can be issued and keep any remaining quantity visible." },
      { title: "Mapping or movement mismatch", detail: "Review item, unit and warehouse mappings before proceeding or closing the request." },
    ],
    boundary: "Portfolio scope covers master-data mapping, quantity validation and ERP movement reconciliation. Transfer activation is subject to validation.",
  },
  {
    slug: "maintenance-module",
    title: "Maintenance Module",
    description:
      "Follow preventive and breakdown maintenance from the first report or scheduled task through review.",
    steps: [
      {
        owner: "Plant team",
        title: "Open a maintenance activity",
        detail: "Start from a preventive maintenance schedule or log a breakdown reported by the plant team.",
      },
      {
        owner: "Maintenance planner",
        title: "Assess and assign the work",
        detail: "Identify the equipment, describe the task or failure and agree on the priority, timing and owner.",
      },
      {
        owner: "Maintenance & warehouse",
        title: "Check spare-parts needs",
        detail: "Identify required parts, check availability with the warehouse and record any dependency.",
      },
      {
        owner: "Technician",
        title: "Perform and track the work",
        detail: "Record the work performed, update progress and flag any dependency that blocks completion.",
      },
      {
        owner: "Maintenance team",
        title: "Verify equipment condition",
        detail: "Review the service or repair result with the plant team and capture any remaining issue.",
      },
      {
        owner: "Maintenance planner",
        title: "Close or schedule follow-up",
        detail: "Record the outcome and capture outstanding work for the next maintenance activity.",
      },
    ],
    exceptions: [
      { title: "Part unavailable", detail: "Record the waiting status and confirm the next action with the warehouse." },
      { title: "Issue persists after repair", detail: "Keep the activity open for diagnosis and record the follow-up required." },
    ],
    boundary: "Portfolio scope covers maintenance coordination and progress tracking. Spare-parts availability illustrates a warehouse handoff.",
  },
] as const satisfies readonly OperationalFlow[];
