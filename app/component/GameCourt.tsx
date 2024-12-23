import Image from "next/image";
import { Interface } from "readline";
interface gameplayers {
    p1: number;
    p2: number;
    p3: number;
    p4: number;
    clubid: number;
}

export default function GameCourt({ p1, p2, p3, p4, clubid }: gameplayers) {
    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex bg-yellow-300 h-1/2">
                <div className="flex flex-row justify-center items-center w-1/2  bg-blue-300">
                    <div className="rounded-lg overflow-hidden">
                        <Image
                            src="/IMG_6290.jpg"
                            alt="1"
                            width={50}
                            height={50}
                            style={{
                                objectFit: "cover",
                                width: "50px",
                                height: "50px",
                            }}
                        />
                    </div>
                    <div className="ml-3">
                        <div className="text-xs">방정현</div>
                        <div> 40 B</div>
                    </div>
                </div>
                <div className="w-1/2  bg-green-200">2</div>
            </div>
            <div className="flex bg-red-300 h-1/2">
                <div className="w-1/2 bg-purple-300">3</div>
                <div className="w-1/2 bg-orange-300">4</div>
            </div>
        </div>
    );
}
