interface PlayerProps {
    id: number;
    name: string;
    grade: string | null;
    gender: string | null;
    age: number | null;
    avater: string | null;
    clubid: number;
    mmr: number;
}

export default function WaitPlayer(props: {
    players: PlayerProps[];
    onPlayerClick: (clickedPlayer: PlayerProps) => void;
}) {
    function onPlayerClick(clickedPlayer: PlayerProps): PlayerProps {
        console.log(clickedPlayer);
        return clickedPlayer;
    }
    return (
        <div>
            {props.players.map((player, idx) => {
                return (
                    <div
                        onClick={() => {
                            onPlayerClick(player);
                        }}
                        key={idx}
                    >
                        <div>{player.name}</div>
                        <div>{player.grade}</div>
                        <div>{player.age}</div>
                    </div>
                );
            })}
        </div>
    );
}
