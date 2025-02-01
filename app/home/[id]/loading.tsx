import Image from "next/image";

export default function Loading() {
    return (
        <div>
            <Image src="/loading.gif" width={100} height={100} alt="loading" />
            Loading...
        </div>
    );
}
