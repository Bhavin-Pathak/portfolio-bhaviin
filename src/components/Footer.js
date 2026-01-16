import VisitorCounter from "./VisitorCounter.js";

export default function Footer() {
    return (
        <footer className="w-full bg-transparent py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-3">
                <VisitorCounter />
                <div className="text-gray-400 text-[10px] md:text-sm text-center font-medium opacity-60">
                    © {new Date().getFullYear()} Bhavin Pathak • All rights reserved.
                </div>
            </div>
        </footer>
    );
}
