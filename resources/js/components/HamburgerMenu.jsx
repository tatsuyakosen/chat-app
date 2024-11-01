import React, { useState } from "react";

const HamburgerMenu = ({ onInvite }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            {/* ハンバーガーアイコン */}
            <button onClick={toggleMenu} className="focus:outline-none">
                <span className="text-xl font-bold">＋</span>
            </button>
            
            {/* メニュー表示 */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg z-50">
                    <button
                        onClick={onInvite}
                        className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                    >
                        招待
                    </button>
                </div>
            )}
        </div>
    );
};

export default HamburgerMenu;
