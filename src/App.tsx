/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppProvider, useApp } from './store/AppContext';
import TitleScreen from './screens/TitleScreen';
import ArenaScreen from './screens/ArenaScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';

function ScreenManager() {
  const { currentScreen } = useApp();

  return (
    <div className="absolute inset-0 bg-zinc-950 flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      {currentScreen === 'title' && <TitleScreen />}
      {currentScreen === 'arena' && <ArenaScreen />}
      {currentScreen === 'leaderboard' && <LeaderboardScreen />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ScreenManager />
    </AppProvider>
  );
}
