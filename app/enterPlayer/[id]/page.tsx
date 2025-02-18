import EnterPlayerForm from "./EnterPlayerForm";

export default async function EnterPlayer({ params }: { params: Promise<{ id: number }> }) {
    const id = Number((await params).id);
    return (
        <div>
            <EnterPlayerForm id={id} />
        </div>
    );
}
