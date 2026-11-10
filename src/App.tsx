/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppProvider, useApp } from './store/AppContext';
import TitleScreen from './screens/TitleScreen';
import ArenaScreen from './screens/ArenaScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import { Providers } from './providers';
import { GMButton } from './components/GMButton';
import { DenimBanner } from './components/DenimBanner';

function ScreenManager() {
  const { currentScreen } = useApp();

  return (
    <div className="absolute inset-0 bg-zinc-950 flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] overflow-hidden">
      {/* Top Header Bar for Global Network Status & Quick GM Action */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <DenimBanner />
        </div>
        <div className="pointer-events-auto">
          <GMButton />
        </div>
      </div>

      {currentScreen === 'title' && <TitleScreen />}
      {currentScreen === 'arena' && <ArenaScreen />}
      {currentScreen === 'leaderboard' && <LeaderboardScreen />}
    </div>
  );
}

export default function App() {
  return (
    <Providers>
      <AppProvider>
        <ScreenManager />
      </AppProvider>
    </Providers>
  );
}
