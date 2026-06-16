import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-[#0a0a0a] text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 gap-8 sm:gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-xl font-extrabold tracking-tight">
                RAREDROP
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/50">
              Limited edition fashion &amp; accessories. Every piece produced in
              strictly limited quantities — once sold, gone forever.
            </p>
            <div className="flex gap-4">
              {/* Instagram */}
              <a
                href="https://instagram.com/raredrop.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                </svg>
              </a>
              {/* Twitter / X */}
              <a
                href="https://x.com/raredrop_in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Email */}
              <a
                href="mailto:support@raredrop.in"
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Email"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 7l-10 7L2 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/men", label: "Men" },
                { href: "/women", label: "Women" },
                { href: "/kids", label: "Kids" },
                { href: "/unisex", label: "Unisex" },
                { href: "/accessories", label: "Accessories" },
                { href: "/exclusive", label: "Exclusive 1/1" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
              Company
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/#about", label: "About Us" },
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms & Conditions" },
                { href: "/shipping-policy", label: "Shipping Policy" },
                { href: "/refund-policy", label: "Refund & Returns" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
              Help
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/contact", label: "Contact Us" },
                { href: "/faq", label: "FAQ" },
                { href: "/track-order", label: "Track Order" },
                { href: "/size-guide", label: "Size Guide" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 rounded-lg border border-white/10 bg-white/5 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold">Get Notified About Drops</h3>
              <p className="text-xs text-white/40">
                Be the first to know when a new limited edition drop goes live.
                No spam, ever.
              </p>
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors w-full sm:w-64"
              />
              <button
                type="submit"
                className="shrink-0 rounded-md bg-white px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-black hover:bg-white/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/30">
            &copy; {currentYear} RAREDROP. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 text-[10px] text-white/30">
            <Link
              href="/privacy-policy"
              className="hover:text-white/60 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-white/60 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/refund-policy"
              className="hover:text-white/60 transition-colors"
            >
              Refunds
            </Link>
            <Link
              href="/shipping-policy"
              className="hover:text-white/60 transition-colors"
            >
              Shipping
            </Link>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-white/30">
            <span>🇮🇳</span>
            <span>Made in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
