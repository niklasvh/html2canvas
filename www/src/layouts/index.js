import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Navigation from '../components/navigation';
require('prismjs/themes/prism-solarizedlight.css');
import './index.css';

const TemplateWrapper = ({children}) =>
    <div>
        <Helmet
            title="Gatsby Default Starter"
            meta={[
                {name: 'description', content: 'Sample'},
                {name: 'keywords', content: 'sample, something'}
            ]}
        />
        <Navigation />
        {children()}
    </div>;

TemplateWrapper.propTypes = {
    children: PropTypes.func
};

export default TemplateWrapper;
