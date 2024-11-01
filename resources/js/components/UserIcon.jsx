// UserIcon.jsx
import React from 'react';

function UserIcon({ onClick }) {
    return (
        <div onClick={onClick} className="cursor-pointer inline-flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white">
            👥
        </div>
    );
}

export default UserIcon;
