import "./globals.css";

export const metadata = {
  title: "Reasonable Comp Calculator | Professional S-Corp Compensation Analysis",
  description: "Professional compensation analysis tool for S-Corp owners. Calculate market-appropriate salaries with confidence using industry-standard methodologies.",
  keywords: "S-Corp compensation, reasonable salary, tax compliance, business owner salary, IRS guidelines",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Reasonable Compensation Calculator",
              "description": "Professional S-Corp compensation analysis tool for business owners and tax professionals",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web Browser",
              "isAccessibleForFree": true,
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "provider": {
                "@type": "Organization",
                "name": "Cardiff Tax Pros",
                "url": "https://www.cardifftax.com",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Encinitas",
                  "addressRegion": "CA",
                  "addressCountry": "US"
                }
              },
              "featureList": [
                "Market-based compensation analysis",
                "Industry-specific salary calculations",
                "S-Corp compliance guidelines",
                "PDF report generation",
                "Professional consultation referral"
              ]
            })
          }}
        />
      </head>
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
