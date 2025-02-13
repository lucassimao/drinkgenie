import Link from "next/link";
import { BackToTop } from "./footer/BackToTop";
import { NewsletterSignup } from "./footer/NewsletterSignup";
import { QuickLinks } from "./footer/QuickLinks";
import { SocialLinks } from "./footer/SocialLinks";

export function Footer() {
  const displayFeaturedIn = false;

  return (
    <footer className="relative bg-primary mt-12">
      <div className="absolute inset-0 bg-linear-to-b from-primary-dark to-primary opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              About DrinkGenie
            </h3>
            <p className="text-white/70 leading-relaxed">
              Your magical companion in discovering and creating amazing
              cocktails. We blend AI technology with mixology expertise to help
              you craft the perfect drink.
            </p>
            {displayFeaturedIn && (
              <div className="pt-4">
                <span className="text-white/40 text-sm">Featured in:</span>
                <div className="flex gap-4 mt-2">
                  {["forbes.svg", "techcrunch.svg", "wired.svg"].map((logo) => (
                    <img
                      key={logo}
                      src={`/icons/press/${logo}`}
                      alt=""
                      className="h-6 opacity-50"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <QuickLinks />

          {/* Social Links */}
          <SocialLinks />

          {/* Newsletter Signup */}
          <NewsletterSignup />
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-white/40">
              <Link
                href="/privacy"
                className="hover:text-white/60 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/privacy#data-usage"
                className="hover:text-white/60 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy#cookies"
                className="hover:text-white/60 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
            <p className="text-sm text-white/40">
              © {new Date().getFullYear()} DrinkGenie. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <BackToTop />
    </footer>
  );
}
