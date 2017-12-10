import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Navigation from '../components/navigation';
require('prismjs/themes/prism-solarizedlight.css');
import './index.css';

const TemplateWrapper = ({children}) =>
    <div>
        <Helmet title="html2canvas" />
        <Navigation />
        {children()}
        <footer
            css={{
                marginLeft: '300px',
                backgroundColor: '#558b2f',
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 300,
                minHeight: '50px',
                lineHeight: '50px',
                padding: '10px 0px'
            }}
        >
            <div css={{margin: '0 auto', width: '85%'}}>
                Created by{' '}
                <a href="https://hertzen.com" css={{color: '#fff', fontWeight: 'bold'}}>
                    Niklas von Hertzen
                </a>. Licensed under the MIT License.
            </div>
        </footer>
    </div>;

TemplateWrapper.propTypes = {
    children: PropTypes.func
};

export default TemplateWrapper;
