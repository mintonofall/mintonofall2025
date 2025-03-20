export default function WaitPlayer(props: { players: string[] }) {
    return (
        <div>
            {props.players.map((player, idx) => {
                return <div key={idx}>{player}</div>;
            })}
            선수명단
        </div>
    );
}
