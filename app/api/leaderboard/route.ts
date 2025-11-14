import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");

    const db = await getDb();
    const accounts = db.collection("accounts");

    const topPlayers = await accounts
      .find({})
      .sort({ cheeseCount: -1 })
      .limit(limit)
      .project({
        playerName: 1,
        cheeseCount: 1,
        shamanLevel: 1,
        normalSaves: 1,
        hardSaves: 1,
        divineSaves: 1,
      })
      .toArray();

    const leaderboard = topPlayers.map((player, index) => ({
      rank: index + 1,
      playerName: player.playerName,
      cheeseCount: player.cheeseCount || 0,
      shamanLevel: player.shamanLevel || 0,
      saves:
        (player.normalSaves || 0) +
        (player.hardSaves || 0) +
        (player.divineSaves || 0),
    }));

    return NextResponse.json({ success: true, data: leaderboard });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
