import React from 'react';
import Helmet from 'react-helmet';
import './layout.css';
import Example from '../components/example';

require('prismjs/themes/prism-solarizedlight.css');
const TemplateWrapper = ({children}) =>
    <div>
        <Helmet title="html2canvas - Screenshots with JavaScript" />
        {children}
        <Example />
    </div>;

export default TemplateWrapper;
