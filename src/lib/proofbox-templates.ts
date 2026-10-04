import { BriefcaseBusiness, CircleDollarSign, Handshake, HeartHandshake, KeyRound, PackageCheck, ShoppingBag, Wrench } from "lucide-react";

export type ProofBoxTemplate = {
  slug: string;
  name: string;
  type: string;
  description: string;
  title: string;
  details: string;
  terms: string;
  responsibilities: string;
  icon: typeof Handshake;
};

export const proofBoxTemplates: ProofBoxTemplate[] = [
  { slug: "borrowing", name: "Borrowing", type: "Borrow", description: "For lending items, equipment or devices.", title: "Item borrowing", details: "Record what is being borrowed, its condition and value.", terms: "Include the return date and any conditions for damage or late return.", responsibilities: "The owner provides the item as described. The borrower keeps it safe and returns it on time.", icon: Handshake },
  { slug: "payment", name: "Payment", type: "Payment", description: "For recording payments, installments and balances.", title: "Payment agreement", details: "Record the total amount, what it covers and the people involved.", terms: "Include installment amounts, dates and accepted payment methods.", responsibilities: "The payer sends each amount by the agreed date. The recipient confirms each payment.", icon: CircleDollarSign },
  { slug: "sale", name: "Sale", type: "Sale", description: "For recording item sales.", title: "Item sale", details: "Describe the item, condition, agreed price and handover.", terms: "Include payment and delivery or collection terms.", responsibilities: "The seller provides the item as described. The buyer pays the agreed amount.", icon: ShoppingBag },
  { slug: "rental", name: "Rental", type: "Rental", description: "For rental arrangements.", title: "Rental arrangement", details: "Describe the property or item, rental period and condition.", terms: "Include rent, deposit, due dates and return conditions.", responsibilities: "The owner provides access as agreed. The renter pays on time and takes reasonable care.", icon: KeyRound },
  { slug: "freelance", name: "Freelance", type: "Service", description: "For freelance projects and services.", title: "Freelance project", details: "Describe the deliverables, milestones and expected outcome.", terms: "Include price, revisions, delivery dates and payment schedule.", responsibilities: "The freelancer delivers the agreed work. The client supplies feedback and pays on schedule.", icon: BriefcaseBusiness },
  { slug: "delivery", name: "Delivery", type: "Delivery", description: "For deliveries and handovers.", title: "Delivery record", details: "Describe the goods, destination and expected condition.", terms: "Include the delivery date and who can receive the goods.", responsibilities: "The sender provides the goods. The receiver confirms condition and receipt.", icon: PackageCheck },
  { slug: "service", name: "Service", type: "Service", description: "For service-based work.", title: "Service agreement", details: "Describe the service, scope and expected result.", terms: "Include fees, timing, materials and completion conditions.", responsibilities: "The provider performs the agreed service. The customer provides access and payment.", icon: Wrench },
  { slug: "personal-commitment", name: "Personal Commitment", type: "Promise", description: "For personal agreements and commitments.", title: "Personal commitment", details: "Describe the commitment clearly and why it matters.", terms: "Include the target date and what completion means.", responsibilities: "Each person follows through on the commitment they accepted.", icon: HeartHandshake },
];

export function getTemplate(slug: string | undefined) {
  return proofBoxTemplates.find((template) => template.slug === slug);
}