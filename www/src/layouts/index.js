import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
require('prismjs/themes/prism-solarizedlight.css');
import './index.css';
import Example from '../components/example';

const TemplateWrapper = ({children}) =>
    <div>
        <Helmet title="html2canvas - Screenshots with JavaScript" />
        {children()}
        <Example />
    </div>;

TemplateWrapper.propTypes = {
    children: PropTypes.func
};

export default TemplateWrapper;
