import React, { useState } from "react";
import HamburgerMenu from "./HamburgerMenu";

const UserIcon = ({ members, onInvite }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-xl focus:outline-none">
                👥
            </button>
            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg p-2 z-50">
                    <h4 className="font-semibold mb-2">メンバー</h4>
                    <div className="flex flex-wrap">
                        {members.map((member, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-gray-200 rounded-full text-xs m-1"
                            >
                                {member.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserIcon;
