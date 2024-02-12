import React from 'react';

const DisplayMobileTokens: React.FC<{ mobileTokens: JSX.Element[][] }> = ({ mobileTokens }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column', // Display rows one above the other
            justifyContent: 'center',
            gap: 20,
            marginLeft: 0,
            marginTop: 5,
            width: '90%',
            alignItems: 'center',
        }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                {mobileTokens.map((row, rowIndex) => (
                    <React.Fragment key={`mobileRow_${rowIndex}`}>
                        {row.map((element, colIndex) => (
                            <div key={`mobileElement_${rowIndex}_${colIndex}`} style={{ margin: 2 }}>
                                {element}
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default DisplayMobileTokens;
