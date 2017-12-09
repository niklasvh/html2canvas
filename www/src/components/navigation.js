import React from 'react';
import Link from 'gatsby-link';

const lineLinkStyle = {
    lineHeight: '44px',
    height: '44px',
    padding: '0 30px',
    display: 'block',
    '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.05)'
    },
    transition: '.3s ease-out'
};

const navStyle = {
    height: '100%',
    width: '300px',
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: '#fff',
    boxShadow:
        '0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)'
};

const links = [
    {href: '/about', text: 'About'},
    {href: '/getting-started', text: 'Getting started'},
    {href: '/configuration', text: 'Configuration'},
    {href: '/features', text: 'Features'},
    {href: '/proxy', text: 'Proxy'},
    {href: '/faq', text: 'FAQ'}
];

export default () =>
    <div style={navStyle}>
        <ul
            style={{
                listStyle: 'none',
                margin: 0,
                padding: 0
            }}
        >
            {links.map(({href, text}, i) =>
                <li style={{padding: 0, margin: 0}} key={i}>
                    <Link to={href} css={lineLinkStyle}>
                        {text}
                    </Link>
                </li>
            )}
        </ul>
    </div>;
