import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Play, Users, Trophy, Settings } from "lucide-react";
import { getDb } from "@/lib/mongodb";

export default async function Home() {
  let stats = { totalPlayers: 0, totalCheese: 0, totalSaves: 0 };

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

    stats = {
      totalPlayers,
      totalCheese: aggregateResult[0]?.totalCheese || 0,
      totalSaves: aggregateResult[0]?.totalSaves || 0,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center py-12 md:py-16 space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent animate-in fade-in duration-1000">
            Transformice Private Server
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            ¡Juega Transformice en tu navegador con Ruffle! Sin descargas,
            directamente desde la web.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link href="/game">
              <Button
                size="lg"
                className="text-lg px-10 py-7 shadow-lg hover:shadow-xl transition-all"
              >
                <Play className="mr-2 h-6 w-6" />
                Jugar Ahora
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-7 border-2 hover:border-primary/50 transition-all"
              >
                <Trophy className="mr-2 h-6 w-6" />
                Ver Rankings
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-8 pb-6 text-center">
                <Users className="h-10 w-10 text-primary mx-auto mb-3" />
                <p className="text-4xl font-bold text-foreground mb-2">
                  {stats.totalPlayers}
                </p>
                <p className="text-base text-muted-foreground font-medium">
                  Jugadores Registrados
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-secondary/50 transition-colors">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="text-4xl mb-3">🧀</div>
                <p className="text-4xl font-bold text-foreground mb-2">
                  {stats.totalCheese.toLocaleString()}
                </p>
                <p className="text-base text-muted-foreground font-medium">
                  Quesos Obtenidos
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-8 pb-6 text-center">
                <Trophy className="h-10 w-10 text-primary mx-auto mb-3" />
                <p className="text-4xl font-bold text-foreground mb-2">
                  {stats.totalSaves.toLocaleString()}
                </p>
                <p className="text-base text-muted-foreground font-medium">
                  Ratones Salvados
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 mt-16">
          <Card className="border hover:border-primary/50 hover:shadow-lg transition-all">
            <CardHeader>
              <Play className="h-10 w-10 text-primary mb-3" />
              <CardTitle className="text-xl">Juego Instantáneo</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Juega directamente en tu navegador sin descargas ni
                instalaciones gracias a Ruffle
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border hover:border-primary/50 hover:shadow-lg transition-all">
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-3" />
              <CardTitle className="text-xl">Comunidad Activa</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Únete a una comunidad de jugadores apasionados por Transformice
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border hover:border-primary/50 hover:shadow-lg transition-all">
            <CardHeader>
              <Trophy className="h-10 w-10 text-primary mb-3" />
              <CardTitle className="text-xl">Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Compite y sube en las tablas de clasificación globales
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border hover:border-primary/50 hover:shadow-lg transition-all">
            <CardHeader>
              <Settings className="h-10 w-10 text-primary mb-3" />
              <CardTitle className="text-xl">Personalizable</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Ajusta la configuración a tu gusto: temas, audio y más opciones
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Game Rules Section */}
        <Card className="mb-12 border-2">
          <CardHeader>
            <CardTitle className="text-3xl">Reglas del Servidor</CardTitle>
            <CardDescription className="text-base">
              Por favor, lee y respeta estas reglas para una mejor experiencia
              de juego
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground text-base">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Respeta a todos los
                jugadores
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> No uses hacks ni trampas
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Juega limpio y
                diviértete
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Reporta cualquier
                comportamiento inapropiado
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Mantén un lenguaje
                apropiado
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-3xl">Sobre el Servidor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-base leading-relaxed">
              Este es un servidor privado de Transformice que utiliza{" "}
              <span className="font-semibold text-foreground">Ruffle</span> para
              emular el juego Flash original. Disfruta de la experiencia clásica
              de Transformice directamente en tu navegador moderno, sin
              necesidad de Adobe Flash Player.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed">
              Nuestro objetivo es mantener viva la experiencia de Transformice,
              permitiendo que tanto jugadores nuevos como veteranos disfruten de
              este icónico juego de plataformas multijugador.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
