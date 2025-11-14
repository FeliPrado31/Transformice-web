"use client";

import { Suspense, lazy } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize, Volume2, VolumeX } from "lucide-react";
import { useGameSettingsStore } from "@/stores/gameSettingsStore";

const RufflePlayer = lazy(() => import("@/components/organisms/RufflePlayer"));

export default function GamePage() {
  const { fullscreen, volume, toggleFullscreen, setVolume } =
    useGameSettingsStore();

  const toggleMute = () => {
    setVolume(volume > 0 ? 0 : 0.7);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-2xl">Transformice Game</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={toggleMute}>
                  {volume > 0 ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleFullscreen}
                >
                  {fullscreen ? (
                    <Minimize className="h-4 w-4" />
                  ) : (
                    <Maximize className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`${
                fullscreen ? "fixed inset-0 z-50 bg-black" : "aspect-video"
              } w-full`}
            >
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-white">Loading Ruffle...</p>
                    </div>
                  </div>
                }
              >
                <RufflePlayer className="w-full h-full" />
              </Suspense>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Controles</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Flechas: Mover</li>
                <li>• Espacio: Saltar</li>
                <li>• Mouse: Interactuar</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consejos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Recoge el queso y llévalo al agujero</li>
                <li>• Coopera con otros jugadores</li>
                <li>• ¡Diviértete!</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
