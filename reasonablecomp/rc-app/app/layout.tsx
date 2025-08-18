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
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
