import BottomNav from "./BottonNav";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <BottomNav />
        </>
    );
}
