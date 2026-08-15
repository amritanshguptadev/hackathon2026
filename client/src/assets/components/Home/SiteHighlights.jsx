import {
    Package,
    CreditCard,
    Headset,
    BadgePercent
} from 'lucide-react'
export default function SiteHighlights() {
    return (
        <>
        
             <div className="raleway hidden md:flex justify-center items-center px-4 ">
            <div className="flex flex-col md:flex-row border border-gray-300 rounded-md w-full md:w-18/20 justify-center bg-white ">
                <div className="flex w-full md:w-1/3 md:p-4 items-center md:justify-center">
                    <div className="m-3">
                        <Package size={35} className="text-black-300" />
                    </div>
                    <div className="m-3">
                        <p className="text-black font-semibold">GENUINE PRODUCTS</p>
                        <p className="text-sm text-gray-500">Customers are verified</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center mx-2">
                    <div className="border-l h-12 border-gray-300" />
                </div>
                
                <div className="flex w-full md:w-1/3 md:p-4 items-center md:justify-center">
                    <div className="m-3">
                        <CreditCard size={35} className="text-black" />
                    </div>
                    <div className="m-3">
                        <p className="text-black font-semibold">SECURE PAYMENT</p>
                        <p className="text-sm text-gray-500">Safe & encrypted</p>
                    </div>
                </div>

                <div className="hidden md:flex items-center mx-2">
                    <div className="border-l h-12 border-gray-300" />
                </div>

                <div className="flex w-full md:w-1/3 md:p-4 items-center md:justify-center">
                    <div className="m-3">
                        <Headset size={35} className="text-black" />
                    </div>
                    <div className="m-3">
                        <p className="text-black font-semibold">24/7 SUPPORT</p>
                        <p className="text-sm text-gray-500">Always here for you</p>
                    </div>
                </div>

                <div className="hidden md:flex items-center mx-2">
                    <div className="border-l h-12 border-gray-300" />
                </div>

                <div className="flex w-full md:w-1/3 md:p-4 items-center md:justify-center">
                    <div className="m-3">
                        <BadgePercent size={35} className="text-black" />
                    </div>
                    <div className="m-3">
                        <p className="text-black font-semibold">BEST PRICE</p>
                        <p className="text-sm text-gray-500">Low prices guaranteed</p>
                    </div>
                </div>
            </div>
        </div>

        </>
    );
}
