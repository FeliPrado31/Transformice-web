import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const accounts = db.collection("accounts");

    const [totalPlayers, aggregateResult] = await Promise.all([
      accounts.countDocuments(),
      accounts
        .aggregate([
          {
            $group: {
              _id: null,
              totalCheese: { $sum: "$cheeseCount" },
              totalSaves: {
                $sum: {
                  $add: ["$normalSaves", "$hardSaves", "$divineSaves"],
                },
              },
            },
          },
        ])
        .toArray(),
    ]);

    const stats = {
      totalPlayers,
      onlinePlayers: 0,
      totalCheese: aggregateResult[0]?.totalCheese || 0,
      totalSaves: aggregateResult[0]?.totalSaves || 0,
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
