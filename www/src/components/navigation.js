import React, {Component} from 'react';
import Link from 'gatsby-link';
import logo from '../images/logo.svg';
import menu from '../images/ic_menu_black_24px.svg';

const lineLinkStyle = {
    lineHeight: '44px',
    height: '44px',
    padding: '0 30px',
    display: 'block',
    color: 'rgba(0,0,0,0.87)',
    fontWeight: '500',
    '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.05)'
    },
    transition: '.3s ease-out'
};

const navStyle = {
    '@media(min-width: 1000px)': {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '300px',
        boxShadow:
            '0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)',
        height: '100%'
    },
    fontSize: '13px',
    backgroundColor: '#fff'
};

const links = [
    {href: '/documentation', text: 'About'},
    {href: '/getting-started', text: 'Getting started'},
    {href: '/configuration', text: 'Configuration'},
    {href: '/features', text: 'Features'},
    {href: '/proxy', text: 'Proxy'},
    {href: '/faq', text: 'FAQ'}
];

export default class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {open: false};
    }
    render() {
        return (
            <div css={navStyle}>
                <div
                    css={{
                        background: '#558b2f',
                        alignItems: 'center',
                        padding: '24px 30px 24px 0px',
                        display: 'flex',
                        '@media(min-width: 1000px)': {
                            padding: '24px 30px 24px 30px'
                        }
                    }}
                >
                    <img
                        src={menu}
                        onClick={() => this.setState(s => ({open: !s.open}))}
                        css={{
                            width: '50px',
                            cursor: 'pointer',
                            margin: '0 20px 0',
                            display: 'block',
                            '@media(min-width: 1000px)': {
                                display: 'none'
                            }
                        }}
                    />
                    <Link to="/">
                        <img src={logo} css={{margin: 0}} />
                    </Link>
                </div>

                <ul
                    css={{
                        display: this.state.open ? 'block' : 'none',
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                        '@media(min-width: 1000px)': {
                            display: 'block'
                        }
                    }}
                >
                    {links.map(({href, text}, i) =>
                        <li style={{padding: 0, margin: 0}} key={i}>
                            <Link
                                to={href}
                                css={lineLinkStyle}
                                activeStyle={{
                                    backgroundColor: '#7cb342',
                                    color: '#fff'
                                }}
                            >
                                {text}
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}
