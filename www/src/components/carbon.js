import React, {Component} from 'react';
import './carbon.css';

export default class Carbon extends Component {
    componentDidMount() {
        if (this.container) {
            const script = document.createElement('script');

            script.src =
                '//cdn.carbonads.com/carbon.js?zoneid=1673&serve=C6AILKT&placement=html2canvashertzencom';
            script.async = true;
            script.id = '_carbonads_js';
            this.container.appendChild(script);
        }
    }

    render() {
        return (
            <div
                {...this.props}
                ref={container => {
                    this.container = container;
                }}
            />
        );
    }
}
