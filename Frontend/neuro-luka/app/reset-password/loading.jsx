export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <div className="flex justify-center">
                    <div className="w-8 h-8 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
            </div>
        </div>
    );
}
