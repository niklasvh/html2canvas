import React from 'react';
import Link from 'gatsby-link';
import back from '../images/ic_arrow_back_black_24px.svg';
import next from '../images/ic_arrow_forward_black_24px.svg';
import Carbon from '../components/carbon';
import Footer from '../components/footer';
import Layout from '../components/layout';
import Helmet from 'react-helmet';
import Navigation from '../components/navigation';

export default ({data}) => {
    const post = data.markdownRemark;

    return (
        <Layout>
            <Helmet
                title={`${post.frontmatter.title} - html2canvas`}
                meta={[{name: 'description', content: post.frontmatter.description}]}
            />
            <Navigation />
            <div
                css={{
                    '@media(min-width: 1000px)': {
                        marginLeft: '300px'
                    },
                    display: 'flex',
                    minHeight: '100vh',
                    flexDirection: 'column'
                }}
            >
                <div
                    style={{
                        background: '#7cb342',
                        marginBottom: '1.45rem',
                        color: '#fff',
                        paddingTop: '1rem',
                        paddingBottom: '1rem'
                    }}
                >
                    <div css={{maxWidth: '960px'}}>
                        <div css={{width: '85%', margin: '0 auto', display: 'flex'}}>
                            <div css={{flex: 1}}>
                                <h1
                                    css={{
                                        padding: '20px 0',
                                        fontSize: '2.8rem',
                                        '@media(min-width: 1000px)': {fontSize: '4.2rem'}
                                    }}
                                >
                                    {post.frontmatter.title}
                                </h1>
                                <h4
                                    css={{
                                        fontWeight: 300,
                                        color: 'rgba(255, 255, 255, 0.6)',
                                        fontSize: '1.8rem',
                                        '@media(min-width: 1000px)': {fontSize: '2.28rem'}
                                    }}
                                >
                                    {post.frontmatter.description}
                                </h4>
                            </div>
                            <Carbon css={{width: '150px', marginLeft: '20px'}} />
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        maxWidth: 960,
                        paddingTop: 0,
                        flexGrow: 1
                    }}
                >
                    <div
                        css={{width: '85%', margin: '0 auto'}}
                        dangerouslySetInnerHTML={{__html: post.html}}
                    />
                </div>
                {(post.frontmatter.previousUrl && post.frontmatter.previousTitle) ||
                (post.frontmatter.nextUrl && post.frontmatter.nextTitle)
                    ? <div
                          css={{
                              backgroundColor: '#7cb342',
                              marginTop: '30px'
                          }}
                      >
                          <div
                              css={{
                                  width: '85%',
                                  display: 'flex',
                                  margin: '0 auto',
                                  alignItems: 'center',
                                  height: '96px'
                              }}
                          >
                              {post.frontmatter.previousUrl && post.frontmatter.previousTitle
                                  ? <Link
                                        to={post.frontmatter.previousUrl}
                                        css={{
                                            flex: 1,
                                            color: '#fff',
                                            display: 'flex',
                                            alignItems: 'flex-end'
                                        }}
                                    >
                                        <div css={{height: '24px'}}>
                                            <img src={back} alt="" />
                                        </div>
                                        <div>
                                            <span
                                                css={{
                                                    display: 'block',
                                                    color: 'rgba(255,255,255,.55)',
                                                    fontSize: '15px',
                                                    lineHeight: '18px',
                                                    marginBottom: '1px'
                                                }}
                                            >
                                                Previous
                                            </span>
                                            <div
                                                css={{
                                                    color: 'rgba(255,255,255,.87)',
                                                    fontSize: '20px'
                                                }}
                                            >
                                                {post.frontmatter.previousTitle}
                                            </div>
                                        </div>
                                    </Link>
                                  : null}
                              {post.frontmatter.nextUrl && post.frontmatter.nextTitle
                                  ? <Link
                                        to={post.frontmatter.nextUrl}
                                        css={{
                                            flex: 1,
                                            color: '#fff',
                                            justifyContent: 'flex-end',
                                            display: 'flex',
                                            alignItems: 'flex-end'
                                        }}
                                    >
                                        <div>
                                            <span
                                                css={{
                                                    display: 'block',
                                                    color: 'rgba(255,255,255,.55)',
                                                    fontSize: '15px',
                                                    lineHeight: '18px',
                                                    marginBottom: '1px'
                                                }}
                                            >
                                                Next
                                            </span>
                                            <div
                                                css={{
                                                    color: 'rgba(255,255,255,.87)',
                                                    fontSize: '20px'
                                                }}
                                            >
                                                {post.frontmatter.nextTitle}
                                            </div>
                                        </div>

                                        <div css={{height: '24px'}}>
                                            <img src={next} alt="" />
                                        </div>
                                    </Link>
                                  : null}
                          </div>
                      </div>
                    : null}
                <Footer css={{marginLeft: '300px'}} />
            </div>
        </Layout>
    );
};

export const query = graphql`
    query DocsQuery($slug: String!) {
        markdownRemark(fields: {slug: {eq: $slug}}) {
            html
            frontmatter {
                title
                description
                previousUrl
                previousTitle
                nextUrl
                nextTitle
            }
        }
    }
`;
