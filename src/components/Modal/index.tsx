import React from 'react';

const Modal: React.FC = ({ children }) => {
    return <div style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.32)'
    }}>
        {children}
    </div>;
}