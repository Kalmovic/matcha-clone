import TokenHistory from "../components/sections/TokenHistory";
import SwapWizard from "../components/wizards/SwapWizard";

export function Page() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-8 md:px-16 lg:px-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="md:col-span-2 lg:col-span-2">
        <TokenHistory />
      </div>
      <div className="md:col-span-1 lg:col-span-1">
        <SwapWizard />
      </div>
    </main>
  );
}

export default Page;
