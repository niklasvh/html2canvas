import React, {Component} from 'react';
import './example.css';
import icon from '../images/ic_camera_alt_black_24px.svg';
import close from '../images/ic_close_black_24px.svg';
import html2canvas from 'html2canvas';

class CanvasContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {open: false, complete: false};
    }

    componentDidMount() {
        if (this.container) {
            this.container.appendChild(this.props.canvas);
            setTimeout(() => {
                this.props.canvas.style.opacity = '1';
                this.props.canvas.style.transform = 'scale(0.8)';
            }, 10);
        }
    }

    render() {
        return (
            <div
                css={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: '99999998',
                    width: '100%',
                    height: '100%'
                }}
                ref={container => (this.container = container)}
                onClick={() => this.props.onClose()}
            >
                <img
                    src={close}
                    css={{position: 'absolute', right: '20px', top: '20px', cursor: 'pointer'}}
                />
            </div>
        );
    }
}

export default class Example extends Component {
    constructor(props) {
        super(props);
        this.state = {open: false, canvas: null};
    }

    render() {
        return (
            <div data-html2canvas-ignore>
                {this.state.canvas
                    ? <CanvasContainer
                          canvas={this.state.canvas}
                          onClose={() => this.setState({canvas: null})}
                      />
                    : null}
                <div
                    css={{
                        width: '800px',
                        height: '800px',
                        position: 'fixed',
                        zIndex: '1000',
                        right: '-348.4px',
                        bottom: '-327.2px',
                        visibility: this.state.open ? 'visible' : 'hidden',
                        transition: 'visibility 0.3s cubic-bezier(0.42, 0, 0.58, 1)'
                    }}
                >
                    <div
                        css={{
                            position: 'absolute',
                            top: '344px',
                            left: '344px',
                            width: '112px',
                            height: '112px',
                            borderRadius: '50%',
                            zIndex: 100001,
                            ':before': {
                                content: ' ',
                                backgroundColor: '#fff',
                                borderRadius: '50%',
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                opacity: this.state.open ? 1 : 0,
                                transition:
                                    'transform 0.3s cubic-bezier(0.42, 0, 0.58, 1),opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1),-webkit-transform 0.3s cubic-bezier(0.42, 0, 0.58, 1)',
                                transform: this.state.open ? 'scale(1)' : 'scale(0)'
                            }
                        }}
                    >
                        <div
                            id="tryhtml2canvas"
                            css={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '56px',
                                height: '56px',
                                backgroundColor: '#33691e',
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                cursor: 'pointer',
                                transform: 'translate(-50%, -50%)',
                                borderRadius: '50%',
                                visibility: 'visible',
                                boxShadow:
                                    '0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)'
                            }}
                            onClick={() => this.setState(({open}) => ({open: !open}))}
                        >
                            <img
                                src={icon}
                                css={{
                                    width: '30px',
                                    height: '30px',
                                    flex: 1,
                                    margin: 0
                                }}
                            />
                        </div>
                    </div>
                    <div
                        css={{
                            backgroundColor: '#33691e',
                            borderRadius: '50%',
                            opacity: this.state.open ? 0.95 : 0,
                            transition:
                                'transform 0.3s cubic-bezier(0.42, 0, 0.58, 1),opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1),-webkit-transform 0.3s cubic-bezier(0.42, 0, 0.58, 1)',
                            transform: this.state.open ? 'scale(1)' : 'scale(0)',
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            zIndex: 100000
                        }}
                    >
                        <div
                            css={{
                                width: '456px',
                                height: '600px',
                                right: '56px',
                                bottom: '56px',
                                padding: '56px',
                                position: 'fixed',
                                left: 0,
                                color: '#fff'
                            }}
                        >
                            <h4>Try out html2canvas</h4>
                            <p css={{color: '#fff'}}>
                                Test out html2canvas by rendering the viewport from the current
                                page.
                            </p>
                            <div
                                css={{
                                    padding: '4px 8px',
                                    margin: '10px',
                                    border: '2px solid #fff',
                                    color: '#fff',
                                    display: 'inline-block',
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    html2canvas(document.body, {
                                        allowTaint: true,
                                        width: window.innerWidth,
                                        height: window.innerHeight,
                                        scrollX: window.pageXOffset,
                                        scrollY: window.pageYOffset,
                                        x: window.pageXOffset,
                                        y: window.pageYOffset
                                    })
                                        .then(canvas => {
                                            this.setState({canvas});

                                            canvas.style.position = 'fixed';
                                            canvas.style.top = '0';
                                            canvas.style.left = '0';
                                            canvas.style.opacity = '0';
                                            canvas.style.transform = 'scale(0)';
                                            canvas.style.zIndex = '99999999';
                                            canvas.style.transition =
                                                'transform 0.3s cubic-bezier(0.42, 0, 0.58, 1),opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1),-webkit-transform 0.3s cubic-bezier(0.42, 0, 0.58, 1)';
                                        })
                                        .catch(e => {
                                            console.log(e);
                                        });
                                }}
                            >
                                Capture
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
