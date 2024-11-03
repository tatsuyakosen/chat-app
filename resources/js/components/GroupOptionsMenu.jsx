// components/GroupOptionsMenu.jsx
import React from "react";

function GroupOptionsMenu({ onRename, onDelete, isOpen, toggleMenu }) {
    return (
        <div className="relative">
            <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-800">
                ...
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg">
                    <button
                        onClick={() => {
                            onRename();
                            toggleMenu(); // 閉じる
                        }}
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    >
                        名前を変更する
                    </button>
                    <button
                        onClick={() => {
                            onDelete();
                            toggleMenu(); // 閉じる
                        }}
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    >
                        削除する
                    </button>
                </div>
            )}
        </div>
    );
}

export default GroupOptionsMenu;
