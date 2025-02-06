export default function projectedStats(
  players: any,
  schedule: any,
  settings: any
) {
  let abc = settings.map(
    (stat: { name: any; stat_id: { toString: () => any } }) => {
      if (
        schedule === undefined ||
        Object.keys(players).length === 0 ||
        schedule.length === 0
      ) {
        return { name: stat.name, value: 0 };
      }

      let value = players
        .map((player: { starting: any[]; averages: any[] }) => {
          let playerStats = player.starting.map((match: { gamePk: number }) => {
            // Loop over each day in the week
            // let gameStat = match.stats.filter((matchStat) => matchStat.stat_id === stat.stat_id.toString())
            let averagedStat = player.averages.find(
              (a: { stat: any }) => a.stat === stat.stat_id.toString()
            );
            // game has been played
            // if (gameStat.length > 0 && gameStat[0].value !== '-') {
            //     return parseFloat(gameStat[0].value)
            // } else
            if (match.gamePk > 0 && averagedStat?.value) {
              return parseFloat(averagedStat.value);
            } else {
              return 0;
            }
          });
          let ps = playerStats.reduce((a: any, b: any) => {
            return a + b;
          }, 0);

          return ps;
        })
        .reduce((a: any, b: any) => {
          return a + b;
        }, 0)
        .toFixed(2);
      return { name: stat.name, value: value };
    }
  );
  return abc;
}
