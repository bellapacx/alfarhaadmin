import { useEffect, useState } from "react";
import axios from "../services/api";

interface DailyCommission {
  date: string;
  total_commission: number;
  total_payment: number;
}

interface WeeklyCommission {
  week_id: string;
  week: string;
  total_commission: number;
  total_payment: number;
}

export default function ShopCommissions({ shopId }: { shopId: string | null }) {
  const [dailyCommissions, setDailyCommissions] = useState<DailyCommission[]>(
    []
  );
  const [weeklyCommissions, setWeeklyCommissions] = useState<
    WeeklyCommission[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCommissions = async () => {
    if (!shopId) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/shop_commission/${shopId}`);
      setDailyCommissions(res.data.daily_commissions || []);
      setWeeklyCommissions(res.data.weekly_commissions || []);
    } catch (err) {
      console.error("Failed to fetch commissions", err);
      setError("Failed to load commissions");
      setDailyCommissions([]);
      setWeeklyCommissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, [shopId]);

  if (!shopId) {
    return <div className="p-4 text-white">No shop selected.</div>;
  }

  if (loading) {
    return <div className="p-4 text-white">Loading commissions...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-400">{error}</div>;
  }

  return (
    <div className="space-y-8 mt-8">
      {/* 🗓️ Daily Commissions */}
      <div className="bg-white/10 text-white p-4 rounded-lg shadow">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Daily Commissions</h2>
        {dailyCommissions.length === 0 ? (
          <p>No daily commissions found.</p>
        ) : (
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="bg-white/20">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Total Commission</th>
                <th className="p-2 text-left">Total Payment</th>
              </tr>
            </thead>
            <tbody>
              {dailyCommissions.map((item) => (
                <tr key={item.date} className="border-t border-white/10">
                  <td className="p-2">{item.date}</td>
                  <td className="p-2">
                    SSP {item.total_commission.toFixed(2)}
                  </td>
                  <td className="p-2">SSP {item.total_payment.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 📅 Weekly Commissions */}
      <div className="bg-white/10 text-white p-4 rounded-lg shadow">
        <h2 className="text-lg sm:text-xl font-bold mb-4">
          Weekly Commissions
        </h2>
        {weeklyCommissions.length === 0 ? (
          <p>No weekly commissions found.</p>
        ) : (
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="bg-white/20">
                <th className="p-2 text-left">Week</th>
                <th className="p-2 text-left">Total Commission</th>
                <th className="p-2 text-left">Total Payment</th>
              </tr>
            </thead>
            <tbody>
              {weeklyCommissions.map((item) => (
                <tr key={item.week_id} className="border-t border-white/10">
                  <td className="p-2">{item.week}</td>
                  <td className="p-2">
                    SSP {item.total_commission.toFixed(2)}
                  </td>
                  <td className="p-2">SSP {item.total_payment.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
