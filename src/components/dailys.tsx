import { dailys } from "../data/dailys";

export function Dailys() {
  return (
    <ul>
      {dailys.map((daily) => {
        return <li key={daily.id}>{daily.title}</li>;
      })}
    </ul>
  );
}
