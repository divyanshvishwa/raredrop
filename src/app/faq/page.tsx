export default function FAQPage() {
  const faqs = [
    {
      q: "What makes RAREDROP pieces exclusive?",
      a: "Every piece in our 1/1 collection is produced in a quantity of exactly 1 worldwide. Core drops are limited to strict small batches that are never restocked.",
    },
    {
      q: "How long does shipping take?",
      a: "Standard shipping across India takes 3–5 business days. Express shipping options are available at checkout.",
    },
    {
      q: "What is your return policy?",
      a: "Due to the limited edition nature of our drops, sales on 1/1 exclusives are final. Standard core items can be returned or exchanged within 7 days of delivery.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight mb-4">Frequently Asked Questions</h1>
      <div className="mt-8 space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-border p-6 rounded-lg bg-card shadow-sm">
            <h2 className="text-base font-bold mb-2">{faq.q}</h2>
            <p className="text-sm text-muted">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
