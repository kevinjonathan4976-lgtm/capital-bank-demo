import { bankData } from "@/lib/data";

export default function Dashboard() {
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-8">
        {bankData.bankName}
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-xl p-6">
          <h2>Savings Account</h2>
          <p className="text-3xl font-bold">
            ${bankData.savings.balance.toLocaleString()}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2>Checking Account</h2>
          <p className="text-3xl font-bold">
            ${bankData.checking.balance.toLocaleString()}
          </p>
        </div>

        <div className="bg-green-600 text-white rounded-xl p-6">
          <h2>Available Balance</h2>
          <p className="text-3xl font-bold">
            ${bankData.availableBalance.toLocaleString()}
          </p>
        </div>
      </div>
    </main>
  );
}
