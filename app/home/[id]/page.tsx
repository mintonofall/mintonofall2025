import db from "@/lib/db";

export default async function GameBoard({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <div>
      <h1>GameBoard</h1>
      <h2>{id}</h2>
    </div>
  );
}
