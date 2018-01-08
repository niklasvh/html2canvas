import React from 'react';

export default () =>
    <footer
        css={{
            backgroundColor: '#558b2f',
            color: 'rgba(255,255,255, 0.8)',
            fontWeight: 300,
            minHeight: '50px',
            lineHeight: '50px',
            padding: '10px 0px'
        }}
    >
        <div
            css={{
                margin: '0 auto',
                fontSize: '10.5px',
                textAlign: 'center',
                '@media(min-width: 1000px)': {
                    textAlign: 'left',
                    width: '85%',
                    fontSize: '14.5px'
                }
            }}
        >
            Created by{' '}
            <a href="https://hertzen.com" css={{color: '#fff', fontWeight: 'bold'}}>
                Niklas von Hertzen
            </a>. Licensed under the MIT License.
        </div>
    </footer>;
