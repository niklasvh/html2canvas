import React from 'react';
import Link from 'gatsby-link';
import logo from '../images/logo_icon.svg';
import Layout from '../components/layout';
import Footer from '../components/footer';
import Carbon from '../components/carbon';

const codeStyle = {
    backgroundColor: '#7cb342',
    textShadow: '0 1px 0 rgba(23, 31, 35, 0.5)',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '3px',
    width: '100%',
    whiteSpace: 'pre-wrap'
};

const linkStyle = {
    padding: '4px 8px',
    margin: '10px',
    border: '2px solid #fff',
    color: '#fff'
};

export default ({data}) => {
    return (
        <Layout>
        <div
            css={{
                background: '#558b2f',
                backgroundImage: 'linear-gradient(0deg, #558b2f, #7cb342)',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <div
                css={{
                    display: 'flex',
                    flexGrow: 1
                }}
            >
                <div
                    css={{
                        maxWidth: 960,
                        color: '#fff',
                        margin: '0 auto',
                        textAlign: 'center',
                        alignSelf: 'center'
                    }}
                >
                    <div css={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <img src={logo} alt="html2canvas" />
                        <h1>html2canvas</h1>
                    </div>
                    <h4 css={{color: 'rgba(255, 255, 255, 0.6)', fontWeight: 300}}>
                        Screenshots with JavaScript
                    </h4>

                    <div
                        css={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            '@media(min-width: 1000px)': {
                                flexDirection: 'row'
                            }
                        }}
                    >
                        <div
                            css={{
                                display: 'none',
                                '@media(min-width: 1000px)': {
                                    display: 'block'
                                }
                            }}
                        >
                            <h4>HTML</h4>
                            <div
                                css={{marginRight: '5px'}}
                                dangerouslySetInnerHTML={{
                                    __html: `<div class="gatsby-highlight">
      <pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>capture<span class="token punctuation">"</span></span><span class="token style-attr language-css"><span class="token attr-name"> <span class="token attr-name">style</span></span><span class="token punctuation">="</span><span class="token attr-value"><span class="token property">padding</span><span class="token punctuation">:</span> 10px<span class="token punctuation">;</span> <span class="token property">background</span><span class="token punctuation">:</span> #f5da55</span><span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h4</span><span class="token style-attr language-css"><span class="token attr-name"> <span class="token attr-name">style</span></span><span class="token punctuation">="</span><span class="token attr-value"><span class="token property">color</span><span class="token punctuation">:</span> #000<span class="token punctuation">;</span> </span><span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span>Hello world!<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h4</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre>
      </div>`
                                }}
                            />
                        </div>
                        <div
                            css={{
                                display: 'none',
                                '@media(min-width: 1000px)': {
                                    display: 'block'
                                }
                            }}
                        >
                            <h4>JavaScript</h4>
                            <div
                                css={{marginLeft: '5px'}}
                                dangerouslySetInnerHTML={{
                                    __html: `<div class="gatsby-highlight">
      <pre class="language-javascript"><code><span class="token function">html2canvas</span><span class="token punctuation">(</span>document<span class="token punctuation">.</span><span class="token function">querySelector</span><span class="token punctuation">(</span><span class="token string">"#capture"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>canvas <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    document<span class="token punctuation">.</span>body<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>canvas<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre>
      </div>`
                                }}
                            />
                        </div>
                    </div>

                    <div css={{margin: '20px'}}>
                        <a
                            href="/documentation"
                            css={linkStyle}
                            onClick={e => {
                                e.preventDefault();
                                document.querySelector('#tryhtml2canvas').click();
                            }}
                        >
                            Try it out
                        </a>
                        <Link to={'/documentation'} css={linkStyle}>
                            Documentation
                        </Link>
                    </div>
                    <div
                        css={{
                            display: 'flex',
                            flexDirection: 'column',
                            '@media(min-width: 1000px)': {
                                flexDirection: 'row'
                            }
                        }}
                    >
                        <div
                            css={{
                                flex: 1,
                                backgroundColor: '#558b2f',
                                padding: '10px 20px',
                                borderRadius: '10px',
                                marginBottom: '10px',
                                '@media(min-width: 1000px)': {
                                    marginRight: '5px'
                                }
                            }}
                        >
                            <Carbon />
                        </div>
                        <div
                            css={{
                                flex: 1,

                                backgroundColor: '#558b2f',
                                padding: '10px 20px',
                                borderRadius: '10px',
                                textAlign: 'left',
                                marginBottom: '10px',
                                '@media(min-width: 1000px)': {
                                    marginLeft: '5px',
                                    marginRight: '5px'
                                }
                            }}
                        >
                            <h6>Install NPM</h6>
                            <code css={codeStyle}>npm install --save html2canvas</code>
                            <h6>Install Yarn</h6>
                            <code css={codeStyle}>yarn add html2canvas</code>
                            <div css={{marginTop: '25px'}}>
                                <a href={'/dist/html2canvas.js'} css={linkStyle}>
                                    html2canvas.js
                                </a>
                                <a href={'/dist/html2canvas.min.js'} css={linkStyle}>
                                    html2canvas.min.js
                                </a>
                            </div>
                            <div css={{textAlign: 'center', marginTop: '10px'}}>
                                {Math.round(data.site.siteMetadata.packageSize / 1024)}kb gzipped
                            </div>
                        </div>
                        <div
                            css={{
                                flex: 1,
                                backgroundColor: '#558b2f',
                                padding: '10px 20px',
                                borderRadius: '10px',
                                textAlign: 'left',
                                marginBottom: '10px',
                                '@media(min-width: 1000px)': {
                                    marginLeft: '5px'
                                }
                            }}
                        >
                            <h5>Connect</h5>
                            <div css={{height: '35px'}}>
                                <iframe
                                    title="Github"
                                    src="https://ghbtns.com/github-btn.html?user=niklasvh&repo=html2canvas&type=star&count=true&size=large"
                                    frameBorder="0"
                                    scrolling="0"
                                    width="160px"
                                    height="30px"
                                />
                            </div>
                            <div>
                                <a
                                    className="twitter-follow-button"
                                    href="https://twitter.com/niklasvh"
                                    data-show-screen-name="false"
                                    data-size="large"
                                >
                                    Follow @niklasvh
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
        </Layout>
    );
};

export const query = graphql`
    query MetadataQuery {
        site {
            siteMetadata {
                packageSize
            }
        }
    }
`;
