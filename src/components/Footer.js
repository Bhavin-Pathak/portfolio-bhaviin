
export default function Footer() {
    return (
        <footer className="w-full bg-transparent py-4 mt-auto">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
                <div className="text-gray-400 text-xs md:text-sm text-center">
                    © {new Date().getFullYear()} Bhavin Pathak. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
