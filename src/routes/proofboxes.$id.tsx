import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/proofboxes/$id")({
  component: ProofBoxLayout,
});

function ProofBoxLayout() {
  return <Outlet />;
}
