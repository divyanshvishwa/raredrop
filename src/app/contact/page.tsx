export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight mb-4">Contact Us</h1>
      <p className="text-muted-foreground mb-8">
        Have questions about your order, custom drops, or general inquiries? Get in touch with us.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border border-border p-6 rounded-lg bg-card shadow-sm">
        <div>
          <h2 className="text-lg font-bold mb-2">Customer Support</h2>
          <p className="text-sm text-muted mb-1">Email: support@raredrop.in</p>
          <p className="text-sm text-muted">Response time: Within 24 hours</p>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2">Headquarters</h2>
          <p className="text-sm text-muted mb-1">RAREDROP Streetwear Studio</p>
          <p className="text-sm text-muted">India</p>
        </div>
      </div>
    </div>
  );
}
