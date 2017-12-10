import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
require('prismjs/themes/prism-solarizedlight.css');
import './index.css';

const TemplateWrapper = ({children}) =>
    <div>
        <Helmet title="html2canvas - Screenshots with JavaScript" />
        {children()}
    </div>;

TemplateWrapper.propTypes = {
    children: PropTypes.func
};

export default TemplateWrapper;
